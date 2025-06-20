from typing import List, Optional, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# Badges
class Badge(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    url: str

# User
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    Name: Optional[str]
    username: Optional[str]
    email: str
    oidcId: str
    bio: Optional[str]
    type: Optional[str]  # Replace with Literal[...] if you know the enum values
    data: Optional[PyObjectId]
    createdAt: Optional[datetime]

# Organization
class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    category: Optional[str]  # Replace with Literal[...] if you know the enum values
    locality: Optional[str]
    events: Optional[List[PyObjectId]]

# Volunteers
class Volunteer(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    skills: Optional[str]  # Replace with List[Literal[...]] if you know the enum values
    experience: Optional[List[PyObjectId]]
    badges: Optional[List[PyObjectId]]

# Messages
class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    senderId: PyObjectId
    receiverId: PyObjectId
    conversationId: Optional[List[PyObjectId]]
    content: str

# Conversations
class Conversation(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user1: PyObjectId
    user2: PyObjectId

# Events
class Event(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    volunteerCap: int
    location: str
    requiredSkills: Optional[str]  # Replace with List[Literal[...]] if you know the enum values
    startTime: datetime
    endTime: datetime
    joinedVolunteers: Optional[List[PyObjectId]]


