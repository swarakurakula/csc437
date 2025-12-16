// src/views/user-profile-view.ts
import { css, html, LitElement } from "lit";

export class UserProfileViewElement extends LitElement {
  render() {
    return html`
      <main class="page">
        <section class="section">
          <h2>Jane Doe</h2>
          <img src="../../janedoe.jpg" alt="Profile Picture" width="150" />
          <p><strong>Username:</strong> JaneDoe123</p>
          <p><strong>Favorite Categories:</strong> Sci-Fi, Comedy, Mystery</p>
          <p><strong>Email:</strong> janedoewriter@gmail.com</p>
          <p>
            <strong>Bio:</strong> Hi! My name is Jane and I am 23 years old. I
            wrote the quirky, humorous, mystery book
            'The Robot Who Became a Detective' and am currently working on the
            second one! YAY! I love writing funny story prompts and inspiring
            other writers every day! Email for collaborations.
          </p>
          <p><strong>Joined:</strong> March 2024</p>
        </section>

        <section class="section">
          <h2>My Posts</h2>
          <ul>
            <li>
              <a>What If Pizza Became the Currency of the World?</a>
            </li>
          </ul>
        </section>

        <section class="section">
          <h2>My Saved Posts</h2>
          <ul>
            <li>
              <a href="comments.html">
                What Happens When Fictional Characters Meet Their Creators?
              </a>
            </li>
          </ul>
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

    .section img {
      border-radius: 50%;
    }

    p {
      color: var(--text-color);
      font-family: var(--font-body);
      font-size: var(--font-size);
      margin: 10px 0;
    }

    ul {
      list-style: disc;
      padding-left: 1.5rem;
    }

    a {
      color: var(--link-color);
    }
  `;
}
