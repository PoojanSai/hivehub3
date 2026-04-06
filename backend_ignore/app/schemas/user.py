from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    model_config = {"from_attributes": True}
