import express from "express";
import session from "express-session";
import path from "path";
import csurf from "csurf";
import methodOverride from "method-override";
import bodyParser from "body-parser";


//ROUTES
import authRouter from "./routes/authRoutes";
import bookRouter from "./routes/bookRoutes";
import mainRouter from "./routes/mainRoutes";
import settingsRouter from "./routes/settingsRoutes";
import dashBoardRouter from  "./routes/dashBoardRoutes";
import rentBookRouter from  "./routes/rentBookRouter";
import healthCheckRouter from  "./routes/healthCheckRouter";

//SESSION CONFIG
import createSessionConfig from "./config/session";

//MIDDLEWARES
import errorHandlerMiddleware from "./middlewares/error-handler";
import checkAuthStatusMiddleware from "./middlewares/check-auth";
import addCsrfTokenMiddleware from "./middlewares/csrf-token";
import ReservationRouter from "./routes/reservationRoutes";
import AuthorRouter from "./routes/authorRoutes";


const app = express();
app.use(methodOverride("_method"));
const PORT = 3000;

//parsira req.body
app.use(bodyParser.json());

//VIEW ENGINE SETUP
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//SERVING STATIC FILES
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();

app.use(session(sessionConfig));

app.use(
  session({
    secret: 'cokolada', 
    resave: false,
    saveUninitialized: true,
  })
);
app.use(csurf());

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

//ROUTES
app.use("/", authRouter);
app.use('/dashboard',dashBoardRouter,checkAuthStatusMiddleware);
//app.use('/dashboard',dashBoardRouter);
app.use("/", mainRouter);
app.use("/books", bookRouter);
app.use("/authors", AuthorRouter);
app.use("/", settingsRouter);
app.use("/", ReservationRouter);
app.use("/", rentBookRouter);
app.use("/health", healthCheckRouter);


app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}.`);
});
