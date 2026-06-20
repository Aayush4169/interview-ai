// import {createBrowserRouter} from "react-router";
// import Login from "./features/auth/pages/Login";
// import Register from "./features/auth/pages/Register";
// import Protected from "./features/auth/components/Protected";
// import Home from "./features/interview/pages/Home"
// import Interview from "./features/interview/pages/Interview"

// export const router = createBrowserRouter([
//     {
//         path:"/login",
//         element:<Login />

//     },
//     {
//         path:"/register",
//         element :<Register />
//     },
//     {
//         path:"/",
//         element:<Protected><Home /></Protected>
//     },
//     {
//         path:"/interview/:interviewId",
//         element :<Protected>< Interview/></Protected>
//     }
// ])


//  claude


import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home"
import Interview from "./features/interview/pages/Interview"
import QuizSection from "./features/quiz/pages/QuizSection"
import QuizPlay from "./features/quiz/pages/QuizPlay"
import QuizResult from "./features/quiz/pages/QuizResult"

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/register",
        element :<Register />
    },
    {
        path:"/",
        element:<Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element :<Protected>< Interview/></Protected>
    },
    {
        path:"/quiz",
        element:<Protected><QuizSection /></Protected>
    },

    
{
  path: "/quiz/:quizId",
  element: <Protected><QuizPlay /></Protected>
},
{
  path: "/quiz/:quizId/result",
  element: <Protected><QuizResult /></Protected>
}
])
