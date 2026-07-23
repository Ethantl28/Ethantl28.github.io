const bootLines =
[
    "INITIALISING G.O.A.T...",
    "",
    "LOADING ARCHIVE INDEX...",
    "",
    "ESTABLISHING SECURE CONNECTION...",
    "",
    "AUTHORISED AS BIRTHDAY_BOY...",
    "",
    "G.O.A.T ONLINE"
];

const files =
[
    {
        name: "BBC_NEWS_WEST_MIDLANDS.MP3",
        path: "AUDIO/BBC_NEWS_WEST_MIDLANDS.MP3",
        password: null,
        hint: "",
        hint_shown: true
    },

        {
        name: "EXPRESS_AND_STAR.JPG",
        path: "DOCUMENTS/EXPRESS_AND_STAR.JPG",
        password: "FARCRY 5",
        hint: "I WONDER WHAT GAME THAT SONG IS USED IN.",
        hint_shown: false
    },

    {
        name: "MAP_SKETCH_ROUGH.JPG",
        path: "DOCUMENTS/MAP_SKETCH_ROUGH.JPG",
        password: "THE LOST",
        hint: "A FAMILIAR NAME PERHAPS",
        hint_shown: false
    },

    {
        name: "EVIDENCE_BOARD_04.JPG",
        path: "DOCUMENTS/EVIDENCE_BOARD_04.JPG",
        password: "LIVERPOOL",
        hint: "FOUR MUSICIANS. ONE CITY SEEMED IMPOSSIBLE TO IGNORE.",
        hint_shown: false
    },

    {
        name: "RECOVERED_AUDIO_08.MP3",
        path: "AUDIO/RECOVERED_AUDIO_08.MP3",
        password: "LIPA",
        hint: "SOME DREAMS BEGIN IN AN OLD GRAMMAR SCHOOL",
        hint_shown: false
    },

    {
        name: "EXPLANATION.MP4",
        path: "VIDEOS/EXPLANATION.MP4",
        password: "MALIBU",
        hint: "I WONDER WHAT THE NAME OF THIS SONG IS?",
        hint_shown: false
    }
];

const passwords = 
{
    "EXPRESS_AND_STAR.JPG": "FARCRY5",
    "MAP_SKETCH_ROUGH.JPG": "THE LOST",
    "EVIDENCE_BOARD_04.JPG": "LIVERPOOL",
    "RECOVERED_AUDIO_08.MP3": "LIPA",
    "EXPLANATION.MP4": "MALIBU"
}

const keySound = new Audio ("Sounds/keyboard_click.mp3");
const startupSound = new Audio ("Sounds/computer_startup.wav");

let selectedFile = null;
const STORAGE_KEY = "unlockedFiles";

function loadUnlockedFiles()
{
    const value = localStorage.getItem(STORAGE_KEY);
    return value !== null ? parseInt(value, 10) : 1;
}

function saveUnlockedFiles()
{
    localStorage.setItem(STORAGE_KEY, unlockedFiles);
}

let unlockedFiles = loadUnlockedFiles();

async function startSystem()
{
    document.getElementById("launch-screen").style.display = "none";

    await bootSequence();
}

async function bootSequence()
{    
    document.getElementById("boot-screen").style.display = "block";

    for (const line of bootLines)
    {
        await typeLine(line, "boot-output");

        await sleep(700);
    }

    await sleep(1000);

    
    document.getElementById("boot-screen").style.display = "none";
    document.getElementById("terminal-title").style.display = "flex";
    document.getElementById("terminal-content").style.display = "block";

    showScreen("MAIN");
    startupSound.currentTime = 0;
    startupSound.play();
}

async function newFileUnlocked(file)
{
    clearTerminal();
    hideTerminalInput(true);

    await typeLine("NEW FILE UNLOCKED...", "terminal-output");
    await sleep(700);
    await typeLine(file.name, "terminal-output");
    await sleep(700);
    await typeLine("IS NOW ACCESSIBLE...", "terminal-output");
    await sleep(1000);
    
    showScreen("MAIN");
    hideTerminalInput(false);
}

async function typeLine(text, elementId)
{
    const output = document.getElementById(elementId);

    const p = document.createElement("p");
    output.appendChild(p);

    for (let i = 0; i < text.length; i++)
    {
        p.textContent += text[i];
        playKeySound();

        if (text[i] != ".")
        {
            await sleep(50);
        }
        else
        {
            await sleep(500);
        }
    }
}

function playKeySound()
{
    keySound.currentTime = 0;
    keySound.play();
}

const terminalInput = document.getElementById("terminal-input");

terminalInput.addEventListener("keydown", function(event)
{
    if (event.key === "Enter")
    {
        processCommand(terminalInput.value);

        terminalInput.value = "";
    }
});

function printHint()
{
    if (!files[unlockedFiles].hint_shown)
    {
        print(files[unlockedFiles].hint);
        files[unlockedFiles].hint_shown = true;
    }
}

function processCommand(command)
{
    command = command.trim().toUpperCase();

    if (unlockedFiles > 5)
    {
        return;
    }

    if (command === "")
    {
        return;
    }

    if (command === "HINT")
    {
        printHint();
        return;
    }

    let showUnknown = true;

    files.forEach((file, index) => {
        if (index  === unlockedFiles)
        {
            if (command === file.password)
            {

                unlockedFiles++;
                saveUnlockedFiles();
                showUnknown = false;
                    
                newFileUnlocked(file);
            }

        }
    });

    if (showUnknown)
    {
        showUnknownCommand();
    }
}

function showUnknownCommand()
{
    printWithTimeout("ERROR: INCORRECT PASSWORD", 2500);
}

async function openFile(file)
{
    if (file.name === "EXPLANATION.MP4")
    {
        window.open("https://youtu.be/qLJuoGr1CZY", '_blank').focus();
        return;
    }

    window.open(file.path, '_blank').focus();
    return;

    clearTerminal();

    hideTerminalInput(true);

    await typeLine("ACCESS GRANTED TO BIRTHDAY_BOY...", "terminal-output")
    await sleep(700);
    await typeLine("OPENING FILE...", "terminal-output");
    await sleep(500);

    openViewer(file.path, file);

    showScreen("MAIN");
}

function openViewer(filePath, fileName)
{
    const viewer = document.getElementById("file-viewer")
    
    viewer.style.display = "flex";
    viewer.classList.add("active");

    document.getElementById("file-name").textContent = fileName.name;

    document.getElementById("file-frame").src = filePath;
}

function closeViewer()
{
    const viewer = document.getElementById("file-viewer")
    
    viewer.style.display = "none";
    viewer.classList.remove("active");

    document.getElementById("file-frame").src = "";

    hideTerminalInput(false);
}

function hideTerminalInput(hide)
{
    const terminalInput = document.querySelector(".terminal-input-row");
    if (hide)
    {
        terminalInput.style.display = "none";
    }
    else
    {
        terminalInput.style.display = "flex";
    }
}

document    
    .getElementById("close-file")
    .addEventListener("click", () =>
    {
        closeViewer();
    });

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showScreen(screen)
{
    clearTerminal();

    const output = document.getElementById("terminal-output");

    files.forEach((file, index) => {
        const button = document.createElement("button");

        if (index >= unlockedFiles)
        {
            button.textContent = "[CLASSIFIED]";
            button.disabled = true;
            button.classList.add("locked");
        }
        else
        {
            button.textContent = file.name;
        }

        button.classList.add("file-button");

        button.addEventListener("click", () =>
        {
            selectedFile = file;
            openFile(file);
        });


        output.appendChild(button);
    });

    print("TYPE \"HINT\" FOR HELP")
}

function print(text)
{
    const output = document.getElementById("terminal-output");

    const line = document.createElement("p");

    line.textContent = text;

    output.appendChild(line);
}

async function printWithTimeout(text, time)
{
    const output = document.getElementById("terminal-output");

    const line = document.createElement("p");

    line.textContent = text;

    output.appendChild(line);

    await sleep(time);

    line.textContent = "";
}

function clearTerminal()
{
    const output = document.getElementById("terminal-output");

    output.innerHTML = "";
}

async function skipBoot()
{
    document.getElementById("launch-screen").style.display = "none";
    document.getElementById("boot-screen").style.display = "none";
    document.getElementById("terminal-title").style.display = "flex";
    document.getElementById("terminal-content").style.display = "block";
    showScreen("MAIN");
}

document.addEventListener("DOMContentLoaded", () =>
{
    if (unlockedFiles > 1)
    {
        skipBoot();
    }
    else
    {
        document
            .getElementById("launch-screen")
            .addEventListener("click", startSystem, {once: true});
    
        document
            .getElementById("launch-screen")
            .addEventListener("touchstart", startSystem, {once: true});
    }
})