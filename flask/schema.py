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

# Enums for strict schema validation
CategoryEnum = Literal["NGO", "School", "Company"]
SkillEnum = Literal["teaching", "first aid", "organization", "teamwork", "security", "media"]
TypeEnum = Literal["volunteer", "admin", "judge", "security", "speaker", "media"]

# Badge
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
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    Name: Optional[str]
    username: Optional[str]
    email: str
    civicId: str
    bio: Optional[str]
    type: Optional[TypeEnum]
    data: Optional[PyObjectId] = None
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Organization
class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    category: CategoryEnum
    locality: Optional[str]
    events: List[PyObjectId] = []

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Volunteer
class Volunteer(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    skills: SkillEnum
    experience: List[PyObjectId] = []
    badges: List[PyObjectId] = []

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Event
class Event(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    description: str
    volunteerCap: int
    location: str
    requiredSkills: SkillEnum
    startTime: datetime
    endTime: datetime
    joinedVolunteers: List[PyObjectId] = []

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Conversation
class Conversation(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user1: PyObjectId
    user2: PyObjectId

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True

# Message
class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    senderId: PyObjectId
    receiverId: PyObjectId
    conversationId: List[PyObjectId] = []
    content: str

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True


