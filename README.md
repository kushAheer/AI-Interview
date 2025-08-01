# InterviewByte 🚀

InterviewByte is a platform designed to streamline and enhance the interview process using AI-powered tools. It allows users to generate interview questions, conduct simulated interviews, and receive detailed feedback. The core features include AI-driven question generation, user authentication, and a customizable interview environment. It solves the problem of inefficient and inconsistent interview preparation by providing a personalized and data-driven approach.

## 🌟 Key Features

- **AI-Powered Question Generation**: Generates relevant and challenging interview questions based on specified roles and skills.
- **Simulated Interviews**: Allows users to practice interviews in a realistic environment with AI-driven feedback.
- **User Authentication**: Securely manages user accounts and access to the platform.
- **Customizable Interview Environment**: Provides options to tailor the interview experience to specific needs.
- **Detailed Feedback**: Offers comprehensive feedback on interview performance, highlighting strengths and areas for improvement.
- **Theming Support**: Includes both light and dark themes for a comfortable user experience.
- **Real-time Notifications**: Uses toast notifications to provide immediate feedback and updates.

## 🛠️ Tech Stack

| Category      | Technology                      | Description                                                                 |
|---------------|---------------------------------|-----------------------------------------------------------------------------|
| **Frontend**  | Next.js                         | React framework for building user interfaces                               |
|               | React                           | JavaScript library for building UIs                                         |
|               | React DOM                       | React package for working with the DOM                                      |
|               | Radix UI                        | Set of accessible UI components                                             |
|               | Lucide React                    | Icon library                                                                |
|               | Tailwind CSS                    | Utility-first CSS framework                                                 |
|               | `class-variance-authority`      | Utility for managing class name variations                                  |
|               | `clsx`                          | Utility for constructing class names                                        |
|               | `tailwind-merge`                | Utility for merging Tailwind CSS classes                                    |
|               | `tailwindcss-animate`           | Tailwind CSS plugin for animations                                          |
| **Backend**   | Firebase                        | Backend-as-a-service for authentication and data storage                   |
|               | Firebase Admin                  | Server-side SDK for Firebase                                                |
| **AI/LLM**    | `@ai-sdk/google`               | AI SDK for Google services                                                  |
|               | `@google/genai`                  | Google's generative AI models                                               |
|               | `ai`                            | AI library                                                                  |
|               | `@vapi-ai/web`                  | VAPI AI web integration                                                     |
| **Utilities** | `zod`                           | Schema validation library                                                     |
|               | `react-hot-toast`               | Library for displaying toast notifications                                   |
| **Build Tools**| `@tailwindcss/vite`            | Tailwind CSS integration with Vite                                          |
|               | `postcss`                       | CSS transformation tool                                                       |
|               | `eslint`                        | JavaScript linter                                                             |
| **Fonts**     | `next/font/google`              | For importing and optimizing Google Fonts                                     |

## 📦 Getting Started / Setup Instructions

### Prerequisites

- Node.js (version >= 18)
- npm or yarn or pnpm or bun
- Firebase project set up with authentication enabled

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd interviewbyte
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install or pnpm install or bun install
    ```

3.  Configure Firebase:

    -   Set up a Firebase project in the Firebase Console.
    -   Enable authentication (e.g., email/password, Google Sign-In).
    -   Obtain your Firebase configuration object.
    -   Create a `.env.local` file in the project root and add your Firebase configuration:

        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=<your_api_key>
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_project_id>
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_storage_bucket>
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_messaging_sender_id>
        NEXT_PUBLIC_FIREBASE_APP_ID=<your_app_id>
        ```

4.  Configure Google GenAI:

    - Obtain your Google GenAI API key.
    - Add the API key to your `.env.local` file:

    ```
    GOOGLE_GENAI_API_KEY=<your_google_genai_api_key>
    ```
5.  Configure VAPI:

    - Obtain your VAPI PUBLIC key AND WorkFlow Id .
    - Add the API key to your `.env.local` file:

    ```
    NEXT_PUBLIC_VAPI_WORKFLOW_ID=<your_vapi_workflow_id>
    NEXT_PUBLIC_VAPI_API_KEY=<your_vapi_api_key>
    ```

### Running Locally

1.  Start the development server:

    ```bash
    npm run dev # or yarn dev or pnpm dev or bun dev
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

## 💻 Project Structure

```
interviewbyte/
├── app/
│   ├── (root)/
│   │   ├── interview/
│   │   │   ├── [id]/
│   │   │   │   ├── feedback/
│   │   │   │   │   └── page.js
│   │   │   │   └── page.js
│   │   │   ├── create/
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   ├── layout.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── Agent.js
│   ├── InterviewCreateForm.js
│   ├── NavBar.js
│   └── Feedback.js
├── lib/
│   ├── actions/
│   │   ├── auth.action.js
│   │   └── general.action.js
├── public/
│   └── pattern.png
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tailwind.config.js
```

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

For questions or feedback, please contact: [Kush Aheer] at [kushaheer709@gmail.com]

## 💖 Thanks Message

Thank you for checking out InterviewByte! We hope this project helps you improve your interview skills and streamline your hiring process.
 