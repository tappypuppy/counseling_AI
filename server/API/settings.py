from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session,declarative_base

# 接続先DBの設定
user = 'root'
password = 'root'
host = 'db'
db_name = 'demo'
DATABASE = f'mysql+mysqlconnector://{user}:{password}@{host}/{db_name}'

# Engine の作成
Engine = create_engine(
  DATABASE,
  echo=True
)

# Sessionの作成
# セッションの作成
db_session = scoped_session(
  sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=Engine
  )
)

session = db_session()

# modelで使用する
Base = declarative_base()
Base.query  = db_session.query_property()
