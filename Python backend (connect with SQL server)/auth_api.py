from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
import hashlib

router = APIRouter()

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return []


def save_users(users):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2)


class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    email: str
    display_name: str
    password: str


class ForgotRequest(BaseModel):
    email: str
    display_name: str
    new_password: str


class RenameRequest(BaseModel):
    email: str
    new_display_name: str


class DeleteRequest(BaseModel):
    email: str


@router.post("/login")
def login(req: LoginRequest):
    users = load_users()
    hashed = hash_password(req.password)
    for user in users:
        if user["email"].strip().lower() == req.email.strip().lower() and user["password"] == hashed:
            return {"success": True, "email": user["email"], "display_name": user["display_name"]}
    raise HTTPException(status_code=401, detail="Invalid email or password.")


@router.post("/signup")
def signup(req: SignupRequest):
    users = load_users()
    if any(u["email"].strip().lower() == req.email.strip().lower() for u in users):
        raise HTTPException(status_code=409, detail="Email already registered.")
    user = {
        "email": req.email.strip(),
        "display_name": req.display_name.strip(),
        "password": hash_password(req.password),
    }
    users.append(user)
    save_users(users)
    return {"success": True, "email": user["email"], "display_name": user["display_name"]}


@router.post("/forgot")
def forgot(req: ForgotRequest):
    users = load_users()
    found = False
    for user in users:
        if (
            user["email"].strip().lower() == req.email.strip().lower()
            and user["display_name"].strip() == req.display_name.strip()
        ):
            user["password"] = hash_password(req.new_password)
            found = True
            break
    if not found:
        raise HTTPException(status_code=404, detail="Email and display name do not match any user.")
    save_users(users)
    return {"success": True}


@router.post("/rename")
def rename(req: RenameRequest):
    users = load_users()
    for user in users:
        if user["email"].strip().lower() == req.email.strip().lower():
            user["display_name"] = req.new_display_name.strip()
            save_users(users)
            return {"success": True, "email": user["email"], "display_name": user["display_name"]}
    raise HTTPException(status_code=404, detail="User not found.")


@router.post("/delete")
def delete(req: DeleteRequest):
    users = load_users()
    new_users = [u for u in users if u["email"].strip().lower() != req.email.strip().lower()]
    if len(new_users) == len(users):
        raise HTTPException(status_code=404, detail="User not found.")
    save_users(new_users)
    return {"success": True}
