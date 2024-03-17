# Project README

### Frontend

A repository with a React/Vite application setup using Tailwind CSS and TypeScript will be provided. The frontend should:

- **Display Books with Filters**: Show a list of books with filters.
- **Detail View**: Display a detailed view of a book.
- **Book Reservation**: Allow users to reserve a book.

#### Bonus Features

- **Cancel a Reservation**: Enable users to cancel a book reservation.
- **Filter Available Books**: Filter books to show only those that are not currently loaned out.

### MCD Details

#### Book Entity:

- **Title**: String
- **Description**: Long text
- **Author**: String
- **Publication Date**: DateTime
- **Genre**: String


### Essential Elements

Each book display must include the following information:
- **Title**: Prominently displayed.
- **Author**: Clearly listed near the title.
- **Publication Date**: Formatted as "Month Year" and located below the author's name.
- **Genre**: Displayed as a tag or badge for easy identification.

### Visual Style Guidelines

- **Color Scheme**: Adhere to the project's color palette to ensure visual coherence across all elements.
- **Typography**: Use the defined font family, size, and weight for titles, descriptions, and other text elements.

### Interactive Elements

- **Design**: https://www.figma.com/file/c3JLEwB73DgcDaeLRKNRq0/Test-technique?type=design&node-id=0-1&mode=design&t=OxaLrE4bWKTWkON4-0
- **Hover Effects**: Implement subtle hover effects for book items to indicate interactiveness.
- **Clickable Components**: Ensure that the entire book card is clickable, leading to a detailed view.

### Functionality and Behavior

- **Loading State**: Include a loading indicator when fetching books from the server.
- **Error Handling**: Display user-friendly error messages for network issues or data retrieval errors.
- **Accessibility**: Ensure that the design is accessible, with proper semantic HTML and ARIA labels where necessary.

## Getting Started

Follow the instructions provided in each repository to set up the backend and frontend environments. Ensure all dependencies are installed and databases are migrated before starting the services.