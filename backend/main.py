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


# In-memory storage: starts empty (no mock contact data)
contacts: list[Contact] = []


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



# Endpoint 4: Update an existing contact message
@app.put("/contacts/{contact_id}")
def update_contact(contact_id: int, submission: ContactSubmission):
    for index, contact in enumerate(contacts):
        if contact.id == contact_id:
            updated_contact = Contact(id=contact_id, **submission.model_dump())
            contacts[index] = updated_contact
            return updated_contact

    raise HTTPException(status_code=404, detail="Contact not found")
