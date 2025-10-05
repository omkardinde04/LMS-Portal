# # train_tfidf_classifier.py
# import os, json
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.linear_model import LogisticRegression
# from sklearn.pipeline import Pipeline
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import classification_report, roc_auc_score
# import joblib

# # 1) Prepare a CSV with columns: text,label   (label: 0=human, 1=ai)
# # Example minimal loading:
# df = pd.read_csv("dataset.csv")  # user provides dataset.csv

# X = df['text'].astype(str).tolist()
# y = df['label'].astype(int).tolist()

# X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)

# pipe = Pipeline([
#     ("tfidf", TfidfVectorizer(ngram_range=(1,3), min_df=2, max_df=0.9)),
#     ("clf", LogisticRegression(max_iter=200))
# ])

# print("Training TF-IDF + LogisticRegression...")
# pipe.fit(X_train, y_train)

# print("Evaluating...")
# y_pred = pipe.predict(X_val)
# y_prob = pipe.predict_proba(X_val)[:,1]
# print(classification_report(y_val, y_pred))
# try:
#     print("ROC AUC:", roc_auc_score(y_val, y_prob))
# except Exception:
#     pass

# # Save model
# os.makedirs("models", exist_ok=True)
# joblib.dump(pipe, "models/tfidf_lr_ai_detector.joblib")
# print("Saved models/tfidf_lr_ai_detector.joblib")
