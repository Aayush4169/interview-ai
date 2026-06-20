// import { RouterProvider } from "react-router"
// import { router } from "./app.routes.jsx"
// import { AuthProvider } from "./features/auth/auth.context.jsx"
// import { InterviewProvider } from "./features/interview/interview.context.jsx"

// function App() {

//   return (
//     <AuthProvider>
//       <InterviewProvider>
//         <RouterProvider router={router} />
//       </InterviewProvider>
//     </AuthProvider>
//   )
// }

// export default App


// claude

import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { QuizProvider } from "./features/quiz/quiz.context.jsx"

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <QuizProvider>
          <RouterProvider router={router} />
        </QuizProvider>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
