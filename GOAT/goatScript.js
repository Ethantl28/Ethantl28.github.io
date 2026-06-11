const bootLines =
[
    "INITIALISING G.O.A.T...",
    "",
    "LOADING ACRCHIVE INDEX...",
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
        "AUDIO",
        "MUSIC",
        "DOCUMENTS",
        "BACK"
    ],

    AUDIO:
    [
        "AUDIO SCREEN",
        "BACK"
    ],

    MUSIC:
    [
        "MUSIC SCREEN",
        "BACK"
    ],

    DOCUMENTS:
    [
        "DOCUMENTS SCREEN",
        "BACK"
    ],

    MAP:
    [
        "MAP SCREEN",
        "BACK"
    ]
};

let currentScreen = "MAIN";

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
        await typeLine(line);

        await new Promise(resolve =>
            setTimeout(resolve, 700) // 700
        );
    }

    await new Promise(resolve =>
        setTimeout(resolve, 1000) // 1000
    );

    
    document.getElementById("boot-screen").style.display = "none";
    document.getElementById("terminal-title").style.display = "flex";
    document.getElementById("terminal-content").style.display = "block";

    showScreen("MAIN");
    startupSound.currentTime = 0;
    startupSound.play();
}

async function typeLine(text)
{
    const output = document.getElementById("boot-output");

    const p = document.createElement("p");
    output.appendChild(p);

    for (let i = 0; i < text.length; i++)
    {
        p.textContent += text[i];
        playKeySound();

        if (text[i] != ".")
        {
            await new Promise(resolve =>
                setTimeout(resolve, 50) // 50
            );
        }
        else
        {
            await new Promise(resolve =>
                setTimeout(resolve, 500) // 500
            );
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

function processCommand(command)
{
    command = command.trim().toUpperCase();

    if (command === "HELP")
    {
        showScreen("HELP");
        return;
    }

    if (command === "BACK")
    {
        back();
        return;
    }

    if (currentScreen === "HELP")
    {
        switch (command)
        {
            case "FILES":
                showScreen("FILES");
                return;
            
            case "MAP":
                showScreen("MAP");
                return;

            default:
                showUnknownCommand();
                return;
        }
    }

    if (currentScreen === "FILES")
    {
        switch (command)
        {
            case "AUDIO":
                showScreen("AUDIO");
                return;

            case "MUSIC":
                showScreen("MUSIC");
                return;

            case "DOCUMENTS":
                showScreen("DOCUMENTS");
                return;

            default:
                showUnknownCommand();
                return;
        }
    }

    if (command != "")
    {
        showUnknownCommand();
    }
}

function back()
{
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

    await new Promise(resolve =>
                setTimeout(resolve, time)
    );

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
    skipBoot();
    // document
    //     .getElementById("launch-screen")
    //     .addEventListener("click", startSystem, {once: true});

    // document
    //     .getElementById("launch-screen")
    //     .addEventListener("touchStart", startSystem, {once: true});
})