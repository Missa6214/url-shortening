import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cookieSession from "cookie-session";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
    cookieSession({
        name: "session",
        keys: [process.env.SESSION_SECRET || "dev-secret-change-me"],
        maxAge: 24 * 60 * 60 * 1000 // 24h
    })
);

// Page principale
app.get("/", (req, res) => {
    const userLinks = req.session.userLinks || [];

    res.render("index", {
        userLinks: userLinks
    });
});

// Raccourcir un lien
app.post("/shorten", async (req, res) => {
    const userLink = req.body.link;

    if (!req.session.userLinks) {
        req.session.userLinks = [];
    }

    try {
        const result = await axios.post(
            "https://cleanuri.com/api/v1/shorten",
            {
                url: userLink.trim()
            }
        );

        const result_url = result.data.result_url;

        req.session.userLinks.push({
            id: Date.now(),
            originalLink: userLink,
            shortenLink: result_url
        });

        res.render("index", {
            userLinks: req.session.userLinks
        });

    } catch (error) {
        console.error(error);

        res.status(500).send("Erreur lors du raccourcissement du lien");
    }
});

// Supprimer un lien
app.delete("/links/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!req.session.userLinks) {
        req.session.userLinks = [];
    }

    const index = req.session.userLinks.findIndex(link => link.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Lien introuvable"
        });
    }

    req.session.userLinks.splice(index, 1);

    res.status(200).json({
        message: "Lien supprimé"
    });
});

export default app;
