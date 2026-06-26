import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../../features/auth/state/auth.slice';
import courseReducer from '../../features/course/state/course.slice';
import sectionReducer from '../../features/section/state/section.slice';
import lessonReducer from '../../features/lesson/state/lesson.slice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        section: sectionReducer,
        lesson: lessonReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
