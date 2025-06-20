from typing import List, Optional, Literal
from datetime import datetime
from pydantic import BaseModel, Field
from bson import ObjectId
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source, handler: GetCoreSchemaHandler):
        return core_schema.no_info_after_validator_function(
            cls.validate, core_schema.str_schema()
        )

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise TypeError("Invalid ObjectId")

# Badges
class Badge(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    url: str

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# User
class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    Name: Optional[str]
    username: Optional[str]
    email: str
    oidcId: str
    bio: Optional[str]
    type: Optional[str]
    data: Optional[PyObjectId] = None
    createdAt: Optional[datetime]

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Organization
class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    category: Optional[str]  # Replace with Literal[...] if you know the enum values
    locality: Optional[str]
    events: Optional[List[PyObjectId]]

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Volunteers
class Volunteer(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    skills: Optional[str]  # Replace with List[Literal[...]] if you know the enum values
    experience: Optional[List[PyObjectId]]
    badges: Optional[List[PyObjectId]]

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Messages
class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    senderId: PyObjectId
    receiverId: PyObjectId
    conversationId: Optional[List[PyObjectId]]
    content: str

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Conversations
class Conversation(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user1: PyObjectId
    user2: PyObjectId

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

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

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True


