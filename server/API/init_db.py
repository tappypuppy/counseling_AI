from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Float, String, Boolean,Text, DateTime
from sqlalchemy.sql import func

# import pandas as pd
import os

user = 'root'
password = 'root'
host = 'db'
db_name = 'demo'

# engineの設定
engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}/{db_name}', echo=True)

# セッションの作成
db_session = scoped_session(
  sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
  )
)

# テーブルを作成する
Base = declarative_base()
Base.query  = db_session.query_property()

print('ok')

# テーブルを定義する
# Baseを継承
class ChatLog(Base):
    __tablename__ = 'chat_log'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(255))
    human_message = Column(Text)
    ai_message = Column(Text)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    def __init__(self, user_id=None, human_message=None, ai_message=None):
        self.user_id = user_id
        self.human_message = human_message
        self.ai_message = ai_message



Base.metadata.create_all(bind=engine)

print('create table ok')



db_session.commit()
db_session.close()