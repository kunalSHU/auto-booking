import json
import sys
import tiktoken

# Model and token counting rules
MODEL = "gpt-4o-mini"


def num_tokens_from_messages(messages, encoding):
    """
    Calculates tokens for a chat payload structure.
    gpt-4o-mini uses the o200k_base encoding and OpenAI ChatML formatting tokens:
    - 3 tokens per message overhead (<|im_start|>{role/name}\n...<|im_end|>)
    - 3 extra tokens per request for assistant priming
    """
    tokens_per_message = 3
    tokens_per_name = 1

    num_tokens = 0
    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            if isinstance(value, str):
                num_tokens += len(encoding.encode(value))
            if key == "name":
                num_tokens += tokens_per_name

    num_tokens += 3  # Every reply is primed with <|start|>assistant<|message|>
    return num_tokens


def count_jsonl_tokens(file_path):
    # Retrieve the encoding corresponding to gpt-4o-mini
    try:
        encoding = tiktoken.encoding_for_model(MODEL)
    except KeyError:
        encoding = tiktoken.get_encoding("o200k_base")

    total_tokens = 0
    total_lines = 0

    with open(file_path, "r", encoding="utf-8") as f:
        for line_number, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue

            try:
                data = json.loads(line)
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON on line {line_number}")
                continue

            total_lines += 1

            # Case 1: Standard Chat / Fine-tuning format {"messages": [...]}
            if "messages" in data:
                total_tokens += num_tokens_from_messages(data["messages"], encoding)

            # Case 2: Batch API request format {"body": {"messages": [...]}}
            elif "body" in data and "messages" in data["body"]:
                total_tokens += num_tokens_from_messages(data["body"]["messages"], encoding)

            # Case 3: Prompt/Completion or raw string
            elif "prompt" in data:
                total_tokens += len(encoding.encode(str(data["prompt"])))
            else:
                # General fallback: tokenize raw line string
                total_tokens += len(encoding.encode(line))

    print(f"File: {file_path}")
    print(f"Total Requests/Lines: {total_lines:,}")
    print(f"Total Tokens: {total_tokens:,}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python count_tokens.py path/to/your_file.jsonl")
    else:
        count_jsonl_tokens(sys.argv[1])