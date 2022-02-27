import torch
from random import choice

replies = ["Hello there!",
           "Good to see you",
           "You look like a charming person",
           "Tell me more about yourself",
           "How do you like me so far? Am i good?",
           "Am I a nice talker",
           "Do you like me?"
           ]

def reply(prompt: str):
    return choice(replies)

def main():
    print("Hello ", torch.cuda.is_available())

    # from transformers import BertTokenizer, BertModel
    # tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    # model = BertModel.from_pretrained("bert-base-uncased")
    # text = "Replace me by any text you'd like."
    # encoded_input = tokenizer(text, return_tensors='pt')
    # output = model(**encoded_input)
    # print(output)


if __name__ == '__main__':
    main()