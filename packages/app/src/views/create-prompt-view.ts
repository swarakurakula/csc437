// src/views/create-prompt-view.ts
import { css, html, LitElement } from "lit";

export class CreatePromptViewElement extends LitElement {
  render() {
    return html`
      <main class="page">
        <h2>Make a Prompt</h2>
        <section class="create-prompt section">
          <form>
            <label for="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter the prompt title."
            />

            <label for="categories">Categories:</label>
            <select id="categories" name="categories" multiple required>
              <option value="Comedy">Comedy</option>
              <option value="Mystery">Mystery</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Adventure">Adventure</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Drama">Drama</option>
              <option value="Historical">Historical</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
            </select>
            <p>
              <small>
                Hold down Ctrl (Windows) or Command (Mac) to select multiple
                categories.
              </small>
            </p>

            <label for="prompt">Prompt:</label>
            <textarea id="prompt" name="description" required></textarea>

            <button type="submit">Submit</button>
          </form>
        </section>
      </main>
    `;
  }

  static styles = css`
    .section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    h2 {
      margin-top: 20px;
    }

    .create-prompt {
      max-width: 600px;
      margin: 20px auto;
      background-color: var(--form-background-color);
      border: 2px solid var(--border-color);
      padding: 20px;
      border-radius: var(--border-radius-large);
    }

    input[type="text"],
    select,
    textarea {
      width: 95%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size);
      color: var(--text-color);
      font-family: var(--font-body);
    }

    button {
      background-color: var(--button-background-color);
      color: var(--header-text-color);
      padding: 10px 15px;
      border: none;
      border-radius: var(--border-radius-small);
      cursor: pointer;
      font-size: var(--font-size);
    }

    button:hover {
      background-color: var(--button-hover-color);
    }

    p {
      color: var(--text-color);
      font-family: var(--font-body);
      font-size: var(--font-size);
      margin: 10px 0;
    }
  `;
}
