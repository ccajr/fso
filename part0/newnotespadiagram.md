0.6: New note in Single page app diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    activate browser
    browser->>browser:
    Note right of browser: Fetch a reference to the HTML form element on the page that has the ID "notes_form" and <br>to register an event handler to handle the form's submit event.<br>The event handler creates a new note, adds it to the notes list with the command <br>notes.push(note), and rerenders the note list on the page.
    deactivate browser

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note left of server: Send the new note to the server as JSON string
    activate server
    server-->>browser: {"message":"note created"}
    deactivate server

    Note right of browser: Response text is logged to console.
```