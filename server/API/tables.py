from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, Float, String, Boolean,Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from settings import db_session,Base,Engine





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

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_name = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    room = relationship('Room', backref='user')
    message = relationship('Message', backref='user')

    def __init__(self, user_name=None):
        self.user_name = user_name

class Room(Base):
    __tablename__ = 'room'
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_name = Column(String(255), nullable=False)
    user_id = Column(ForeignKey('user.id'), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    message = relationship('Message', backref='room')

    def __init__(self, room_name=None ,user_id=None):
        self.room_name = room_name
        self.user_id = user_id

class Message(Base):
    __tablename__ = 'message'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(ForeignKey('user.id'), nullable=False)
    room_id = Column(ForeignKey('room.id'), nullable=False)
    message = Column(Text)
    sender = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    audio = relationship('Audio', backref='message')

    def __init__(self, user_id=None, room_id=None, message=None, sender=None):
        self.user_id = user_id
        self.room_id = room_id
        self.message = message
        self.sender = sender

class Audio(Base):
    __tablename__ = 'audio'
    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(ForeignKey('message.id'), nullable=False)
    file_name = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    def __init__(self, message_id=None, file_name=None):
        self.message_id = message_id
        self.file_name = file_name




if __name__ == "__main__":
    Base.metadata.create_all(bind=Engine)


    print('create table ok')



    db_session.commit()
    db_session.close()