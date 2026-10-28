from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

# Model for a new contact form submission
class ContactSubmission(BaseModel):
    name: str = Field(min_length=1)
    email: str = Field(min_length=1)
    message: str = Field(min_length=1)


# Model for a saved contact message
class Contact(ContactSubmission):
    id: int


# Temporary database with two example messages
contacts = [
    Contact(
        id=1,
        name="Alex",
        email="alex@example.com",
        message="Hi, I really like your portfolio!"
    ),
    Contact(
        id=2,
        name="Taylor",
        email="taylor@example.com",
        message="I would love to collaborate on a project."
    )
]


# Endpoint 1: Get all contact messages
@app.get("/contacts")
def get_contacts():
    return contacts


# Endpoint 2: Add a new contact message
@app.post("/contacts", status_code=201)
def add_contact(submission: ContactSubmission):
    new_id = max([contact.id for contact in contacts], default=0) + 1

    new_contact = Contact(
        id=new_id,
        name=submission.name,
        email=submission.email,
        message=submission.message
    )

    contacts.append(new_contact)
    return new_contact


# Endpoint 3: Delete a contact message by ID
@app.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int):
    for contact in contacts:
        if contact.id == contact_id:
            contacts.remove(contact)
            return {"message": "Contact deleted successfully"}

    raise HTTPException(
        status_code=404,
        detail="Contact not found"
    )

