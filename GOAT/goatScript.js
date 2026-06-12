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

const screens =
{
    MAIN:
    [
        "TYPE `HELP` TO SEE AVAILABLE COMMANDS"
    ],

    HELP:
    [
        "FILES",
        "MAP",
        "BACK"
    ],

    FILES:
    [
        "AUDIO LOGS",
        "MUSIC",
        "DOCUMENTS",
        "BACK"
    ],

    AUDIO:
    [
        "IT_BEGINS.MP3",
        "DETECTIVE_CAMPBELL.MP3",
        "GROUP_MEETING.MP3",
        "BACK"
    ],

    MUSIC:
    [
        "RECOVERED_01.MP3",
        "RECOVERED_02.MP3",
        "RECOVERED_03.MP3",
        "RECOVERED_04.MP3",
        "BACK"
    ],

    DOCUMENTS:
    [
        "EXPRESS_AND_STAR.PDF",
        "MAP_SKETCH.JPG",
        "EVIDENCE_BOARD_04.PDF",
        "BACK"
    ],

    MAP:
    [
        "MAP SCREEN",
        "BACK"
    ],

    PASSWORD:
    [
        "BACK",
        "PLEASE ENTER THE PASSWORD FOR THIS FILE"
    ]
};

const commands = 
{
    MAIN:
    {
        HELP: "HELP"
    },

    HELP:
    {
        FILES: "FILES",
    },

    FILES:
    {
        AUDIO: "AUDIO",
        MUSIC: "MUSIC",
        DOCUMENTS: "DOCUMENTS"
    }
}

const unprotectedFiles = 
{
    AUDIO:
    [
        "IT_BEGINS.MP3"
    ],

    MUSIC:
    [
        "RECOVERED_01.MP3",
        "RECOVERED_02.MP3",
        "RECOVERED_03.MP3",
        "RECOVERED_04.MP3"
    ],
}

const protectedFiles = 
{
    AUDIO:
    [
        "DETECTIVE_CAMPBELL.MP3",
        "GROUP_MEETING.MP3"
    ],

    DOCUMENTS:
    [
        "EXPRESS_AND_STAR.PDF",
        "MAP_SKETCH.JPG",
        "EVIDENCE_BOARD_04.PDF"
    ]
}

const passwords = 
{
    "EXPRESS_AND_STAR.PDF": "FARCRY5",
    "MAP_SKETCH.JPG": "THELOST",
    "EVIDENCE_BOARD_04.PDF": "TOTTENHAM",
    
    "DETECTIVE_CAMPBELL.MP3": "PASSWORD",
    "GROUP_MEETING.MP3": "LIVERPOOL",

    "MAP": "1959"
}

let currentScreen = "MAIN";
let previousScreen = "";
let selectedFile = "";
let ignoreInput = false;

const keySound = new Audio ("Sounds/keyboard_click.mp3");
const startupSound = new Audio ("Sounds/computer_startup.wav");

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
        if (!ignoreInput)
        {
            processCommand(terminalInput.value);
        }

        terminalInput.value = "";
    }
});

function processCommand(command)
{
    command = command.trim().toUpperCase();

    if (command === "")
    {
        return;
    }

    if (command === "BACK")
    {
        back();
        return;
    }

    const screenCommands = commands[currentScreen];

    if (screenCommands && screenCommands[command])
    {
        showScreen(screenCommands[command]);
        return;
    }

    if (protectedFiles[currentScreen]?.includes(command))
    {
        previousScreen = currentScreen;

        selectedFile = command;

        showScreen("PASSWORD");

        return;
    }

    if (unprotectedFiles[currentScreen]?.includes(command))
    {
        previousScreen = currentScreen;

        selectedFile = command;

        openFile(selectedFile, true);

        return;
    }

    if (currentScreen === "PASSWORD")
    {
        testPassword(command);
        return;
    }

    if (currentScreen === "HELP" && command === "MAP")
    {
        selectedFile = "MAP";
        previousScreen = "HELP";

        showScreen("PASSWORD");

        return;
    }

    showUnknownCommand();
}

function back()
{
    if (previousScreen != "")
    {
        showScreen(previousScreen);
        previousScreen = "";
        return;
    }

    switch (currentScreen)
    {
        case "AUDIO":
        case "DOCUMENTS":
        case "MUSIC":
            showScreen("FILES");
            break;

        case "FILES":
        case "MAP":
            showScreen("HELP");
            break;

        default:
            showScreen("MAIN");
            break;
    }
}

function showUnknownCommand()
{
    printWithTimeout("ERROR: UNKNOWN COMMAND", 2500);
}

async function testPassword(attemptedPassword)
{
    if (attemptedPassword === passwords[selectedFile])
    {
        await openFile(selectedFile, false);
    }
    else
    {
        printWithTimeout("INCORRECT PASSWORD", 2500);
    }
}

async function openFile(file, unprotectedFile)
{
    clearTerminal();

    hideTerminalInput(true);

    if (unprotectedFile)
    {
        await typeLine("ACCESS GRANTED TO BIRTHDAY_BOY...", "terminal-output")
        await sleep(700);
        await typeLine("OPENING FILE...", "terminal-output");
        await sleep(500);
    }
    else
    {
        await typeLine("PASSWORD ACCEPTED...", "terminal-output");
        await sleep(700);
        await typeLine("ACCESS GRANTED TO BIRTHDAY_BOY...", "terminal-output")
        await sleep(700);
        await typeLine("OPENING FILE...", "terminal-output");
        await sleep(500);
    }

    openViewer(`${previousScreen}/${file}`, file);

    showScreen(previousScreen);

    previousScreen = "";
}

function openViewer(filePath, fileName)
{
    const viewer = document.getElementById("file-viewer")
    
    viewer.style.display = "flex";
    viewer.classList.add("active");

    document.getElementById("file-name").textContent = fileName;

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

    currentScreen = screen;

    for (const line of screens[screen])
    {
        print(line);
    }
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
    if (true)
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