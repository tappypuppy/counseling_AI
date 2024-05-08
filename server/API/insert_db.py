from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from init_db import chat_log
user = 'root'
password = 'root'
host = 'db'
db_name = 'demo'

# engineの設定
engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}/{db_name}', echo=True)



# データベースセッションを作成
session = Session(bind=engine)

# テストデータを作成
test_data = chat_log(user_id="test_user", human_message="Hello, AI!", ai_message="Hello, human!")
test_data2 = chat_log(user_id="test_user", human_message="こんにちは", ai_message="こんにちは、どうしたのですか?")

# テストデータをセッションに追加
session.add(test_data)
session.add(test_data2)

# 変更をコミット
session.commit()

# セッションを閉じる
session.close()
