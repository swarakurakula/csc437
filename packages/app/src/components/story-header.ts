// src/components/story-header.ts
import { LitElement, css, html } from "lit";
import { Events } from "@calpoly/mustang"; // <-- needed for @change relay

export class StoryHeaderElement extends LitElement {
  render() {
  return html`
    <header class="header">
      <div class="logo">
        <h1>Story Prompt Platform</h1>
        <span>Create, like, and explore story prompts of all kinds!</span>
      </div>

      <nav class="nav">
        <ul>
          <li><a href="/app">Browse Prompts</a></li>
          <li><a href="/app/create">Make a Prompt</a></li>
          <li><a href="/app/profile">My Profile</a></li>
        </ul>
      </nav>

      <div class="user-info">
        <h2>Welcome back, Jane!</h2>
        <img
          src="../../janedoe.jpg"
          alt="Profile Picture"
          class="profile-picture"
        />
      </div>

      <label
        @change=${(ev: InputEvent) =>
          Events.relay(ev, "dark-mode", {
            checked: (ev.target as HTMLInputElement).checked
          })}
      >
        <input type="checkbox" id="dark-mode-toggle" autocomplete="off" />
        Dark mode
      </label>
    </header>
  `;
}


  static styles = css`
    /* This matches your global header rule, but scoped to this component */
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background-color: var(--header-background-color);
      color: var(--header-text-color);
      font-family: var(--font-header);
    }

    /* nav bar details */
    .logo {
      display: flex;
      flex-direction: column;
    }

    .nav ul {
      display: flex;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav a {
      text-decoration: none;
      color: var(--header-text-color);
      font-weight: bold;
    }

    .nav a:hover {
      color: var(--link-color);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-info h2 {
      font-size: 1rem;
      margin: 0;
    }

    .profile-picture {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    /* Bring over your h1 header styling so it applies inside shadow DOM */
    h1 {
      color: var(--primary-color);
      font-family: var(--font-header);
      font-weight: 700;
    }
  `;
}
