# finetune_transformer.py  (sketch)
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer

# load CSV with columns text,label
import pandas as pd
df = pd.read_csv("dataset.csv")
ds = Dataset.from_pandas(df)

model_name = "roberta-base"  # or codebert, etc
tokenizer = AutoTokenizer.from_pretrained(model_name)
def tok_fn(batch):
    return tokenizer(batch["text"], truncation=True, padding="max_length", max_length=512)

ds = ds.map(lambda x: tok_fn(x), batched=True)
ds = ds.rename_column("label", "labels")
ds.set_format(type='torch', columns=['input_ids','attention_mask','labels'])

model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
args = TrainingArguments(
    output_dir="tf_checkpoints",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    fp16=True,
)

trainer = Trainer(model=model, args=args, train_dataset=ds.shuffle().select(range(int(len(ds)*0.9))), eval_dataset=ds.shuffle().select(range(int(len(ds)*0.9), len(ds))))
trainer.train()
trainer.save_model("models/roberta_ai_detector")
