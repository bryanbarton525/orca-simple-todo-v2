# Constitution

> Authored by the Project Manager. Immutable for the rest of the workflow; remediation triage may append a `Constitution Amendment` section but cannot rewrite this file.

## Vision

Create a minimal single-page todo app with HTML, CSS, and vanilla JavaScript.

## Goals

- Users can add todos
- Users can mark todos as complete
- Users can delete todos
- Persist todos in localStorage

## Constraints

- Use only HTML, CSS, and vanilla JavaScript
- No external libraries or frameworks

## Audience

developers and homelab operators

## Output Medium

web application

## Acceptance Criteria

- The app can be opened locally using the provided README instructions.
- Users can add new todos to the list.
- Users can mark existing todos as complete or incomplete.
- Users can delete todos from the list.
- Todos are persisted in localStorage and remain available after refreshing the page.

## Functional Requirements

| ID | Priority | Title | Description | Source |
|---|---|---|---|---|
| F1 | must | Add Todo Functionality | Allow users to add new todos to the list. | director |
| F2 | must | Mark Todo as Complete | Allow users to mark existing todos as complete or incomplete. | director |
| F3 | must | Delete Todo Functionality | Allow users to delete todos from the list. | director |

## Non-Functional Requirements

| ID | Priority | Title | Description | Source |
|---|---|---|---|---|
| NF1 | must | Local Storage Persistence | Todos must be persisted in localStorage and remain available after page refreshes. | director |
| NF2 | should | Responsive Design | The app should have a basic responsive design to work on different screen sizes. | director |

