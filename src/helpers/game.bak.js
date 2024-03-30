import stump from "../assets/stump.png";
import matches from "../assets/matches.png";
import dynamite from "../assets/dynamite.png";
import knife from "../assets/knife.png";
import vines from "../assets/vines.png";
import grease from "../assets/grease.png";
import fire from "../assets/fire.gif";
import boulder from "../assets/boulder.png";


class Game {
    constructor(gameData) {
        this.gameData = gameData;
    }

    getRoomState(roomId) {
        const state = this.gameData.states;
        if (roomId === 6) { return state.boards }
        if (roomId === 4) { return state.tree }
        if (roomId === 5) { return state.vine }
        if (roomId === 11) { return state.boulder }
        if (roomId === 15) { return state.vinehook }
        if (roomId === 21) { return state.whale }
        if (roomId === 24) { return state.kiln }
        return 0;
    }

    directions(state) {
        const rooms = state.rooms;
        const labels = ["north", "east", "south", "west", "up", "down"];
        var directions = [];
        var key = 0;
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i] !== 0) {
                directions.push({
                    "label": labels[i],
                    "roomId": rooms[i],
                    "key": key++
                });
            }
        }
        return directions;
    }

    getThings() {
        var key = 0;
        const roomId = this.gameData.roomId;
        const items = this.gameData.items;
        const states = this.gameData.states;
        var things = [];
        if (roomId === 4 && states.tree === 0) {
            things.push(<img src={stump} key={key++} className="Stump" alt="stump"></img>);
        }
        if (roomId === 24 && states.kiln === 1) {
            things.push(<img src={fire} key={key++} className="Fire" alt="fire"></img>);
        }
        if (roomId === 11 && states.boulder === 0) {
            things.push(<img src={boulder} key={key++} className="Boulder" alt="boulder"></img>);
        }
        for (var i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.roomId === roomId) {
                if (item.name === "matches") {
                    things.push(<img src={matches} key={key++} className="Matches" alt="matches"></img>);
                }
                if (item.name === "dynamite") {
                    things.push(<img src={dynamite} key={key++} className="Dynamite" alt="dynamite"></img>);
                }
                if (item.name === "knife") {
                    things.push(<img src={knife} key={key++} className="Knife" alt="knife"></img>);
                }
                if (item.name === "vines") {
                    things.push(<img src={vines} key={key++} className="Vines" alt="vines"></img>);
                }
                if (item.name === "grease") {
                    things.push(<img src={grease} key={key++} className="Grease" alt="greas"></img>);
                }
            }
        }
        return things;
    }

    getActions() {
        const roomId = this.gameData.roomId;
        const states = this.gameData.states;
        const items = this.gameData.items;
        var actions = [];
        var key = 0;
        if (states.gameover === 1) {
            return [{ action: "restart", target: "game", key: key++ }];
        }
        if (roomId === 5 && states.vine === 0) {
            actions.push({ action: "examine", target: "vines", key: key++ });
            if (this.carrying("knife")) {
                actions.push({ action: "cut", target: "vines", key: key++ });
            }
        }
        if (roomId === 6 && states.boards === 0) {
            if (states.pullboards === 1) {
                actions.push({ action: "pull", target: "boards", key: key++ });
            }
            actions.push({ action: "examine", target: "boards", key: key++ });
        }
        if (roomId === 7) {
            actions.push({ action: "examine", target: "wall", key: key++ });
        }
        if (roomId === 11) {
            if (states.boulder === 0) {
                actions.push({ action: "examine", target: "boulder", key: key++ });
                if (this.carrying("dynamite")) {
                    actions.push({ action: "put", target: "dynamite under boulder", key: key++ });
                }
            }
        }
        if (roomId === 15) {
            actions.push({ action: "examine", target: "hook", key: key++ });
            if (this.carrying("vines")) {
                actions.push({ action: "put", target: "vines on hook", key: key++ });
            }
        }
        if (roomId === 17) {
            actions.push({ action: "examine", target: "human", key: key++ });
        }
        if (roomId === 21) {
            actions.push({ action: "examine", target: "whale", key: key++ });
            if (this.carrying("knife")) {
                actions.push({ action: "cut", target: "whale", key: key++ });
            }
        }
        if ([23, 24].includes(roomId)) {
            actions.push({ action: "examine", target: "hut", key: key++ });
        }
        if (roomId === 24) {
            actions.push({ action: "examine", target: "kiln", key: key++ });
            if (states.kiln === 0) {
                actions.push({ action: "examine", target: "firewood", key: key++ });
                if (this.carrying("matches")) {
                    actions.push({ action: "burn", target: "firewood", key: key++ });
                }
            } else {
                actions.push({ action: "put", target: "dynamite in fire", key: key++ });
            }
            if (this.carrying("dynamite")) {
                actions.push({ action: "put", target: "dynamite in kiln", key: key++ });
            }
        }
        if (roomId === 28) {
            actions.push({ action: "pull", target: "plug", key: key++ });
            actions.push({ action: "examine", target: "plug", key: key++ });
        }
        if (roomId === 4 && this.carrying("matches") && states.tree === 0) {
            actions.push({ action: "burn", target: "tree", key: key++ });
        }
        for (var i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.roomId === roomId) {
                actions.push({ action: "get", target: item.name, key: key++ });
                actions.push({ action: "examine", target: item.name, key: key++ });
            }
            if (item.roomId === 0) {
                actions.push({ action: "drop", target: item.name, key: key++ });
            }
        }
        return actions;
    }

    getRoom() {
        const roomId = this.gameData.roomId;
        const rooms = this.gameData.rooms;
        for (var i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            const currentRoomId = room.id;
            if (currentRoomId === roomId) {
                const stateIndex = this.getRoomState(roomId);
                const state = room.state[stateIndex];
                const directions = this.directions(state);
                return {
                    roomId: roomId,
                    description: room.description,
                    text: state.text,
                    directions: directions
                }
            }
        }
    }

    setRoom(roomId) {
        this.setMessage("");
        this.setMessage("");
        this.gameData.roomId = roomId;
        if (roomId === 25) { this.died() }
        return { ...this.gameData };
    }

    setItemRoom(item, roomId) {
        var update = { ...this.gameData };
        delete update.items;
        update.items = [];
        const items = this.gameData.items;
        for (var i = 0; i < items.length; i++) {
            const og = items[i];
            if (og.name === item) {
                update.items.push({
                    name: item,
                    roomId: roomId
                });
            } else {
                update.items.push(og);
            }
        }
        this.gameData = update;
    }

    carrying(item) {
        const holding = (this.getItemRoom(item) === 0);
        if (item === "matches") {
            return holding && this.gameData.states.matches;
        }
        return holding;
    }

    getItemRoom(item) {
        const items = this.gameData.items;
        for (var i = 0; i < items.length; i++) {
            const name = items[i].name;
            const roomId = items[i].roomId;
            if (name === item) {
                return roomId;
            }
        }
        return 99;
    }

    setState(state, value) {
        this.gameData.states[state] = value;
    }

    setInfo(text) {
        this.gameData.infoLine = text;
    }

    examine(target) {
        const state = this.gameData.states;
        const roomId = this.gameData.roomId;
        switch (target) {
            case "boards":
                this.setMessage("You could probably pull them out");
                this.setState("pullboards", 1);
                break;
            case "matches":
                const count = state.matches;
                if (count === 4) { this.setMessage("The book contains 4 matches") }
                else if (count === 3) { this.setMessage("There's 3 left") }
                else if (count === 2) { this.setMessage("There's 2 left") }
                else if (count === 1) { this.setMessage("Only 1 left") }
                else { this.setMessage("The matchbook is empty") }
                break;
            case "vines":
                if (state.vine === 0) { this.setMessage("Looks useful, if you could cut them down") }
                else { this.setMessage("Quite strong and rope-like") }
                break;
            case "wall":
                this.setMessage("It is very high. You can't climb over");
                break;
            case "dynamite":
                if (state.wetbomb === 1) { this.setMessage("The dynamite is damp. It won't function in this state") }
                else { this.setMessage("The dynamite has been dried out and is now likely dangerous") }
                break;
            case "plug":
                this.setMessage("Water seeps from behind it");
                break;
            case "human":
                const knifeRoom = this.getItemRoom("knife");
                if (knifeRoom === 99) {
                    this.setMessage("A knife is plunged into their chest");
                    this.setItemRoom("knife", roomId);
                } else {
                    this.setMessage("There's a dry, gaping hole in their chest");
                }
                break;
            case "knife":
                this.setMessage("It is still sharp");
                break;
            case "hook":
                this.setMessage("With some rope, you could use it to go up");
                break;
            case "whale":
                this.setMessage("Probably contains useful resources");
                break;
            case "grease":
                this.setMessage("Would make a good lubricants");
                break;
            case "hut":
                this.setMessage("Looks pretty old");
                break;
            case "kiln":
                if (state.kiln === 0) {
                    this.setMessage("Looks functional.The firewood is already loaded");
                } else {
                    this.setMessage("The firewood is burning, the kiln is operational");
                }
                break;
            case "firewood":
                this.setMessage("The firewood is dry as a bone. It would burn easily");
                break;
            case "boulder":
                this.setMessage("Could be destroyed with dynamite");
                break;
            default:
                this.setMessage("You can't examine that");
        }
    }

    push(target) {

    }

    pull(target) {
        switch (target) {
            case "plug":
                this.setMessage("The ocean pours in on you...");
                this.died();
                break;
            case "boards":
                this.setItemRoom("matches", 6);
                this.setState("boards", 1);
                this.setMessage("The boards fall apart, revealing a book of matches");
                break;
            default:
                this.setMessage("You can't push that");
        }
    }

    take(target) {
        this.setItemRoom(target, 0);
    }

    drop(target) {
        const roomId = this.gameData.roomId;
        this.setItemRoom(target, roomId);
    }

    burn(target) {
        const state = this.gameData.states;
        const matchCount = state.matches - 1;
        this.setState("matches", matchCount);
        switch (target) {
            case "tree":
                this.setState("tree", 1);
                this.setMessage("The tree burns to ash, opening a path east");
                break;
            case "firewood":
                this.setState("kiln", 1);
                this.setMessage("The firewood is now burning, the kiln is heating up");
                break;
            default:
                this.setMessage("You can't burn that");
        }



        this.setState(target, 1);
        if (target === "tree") {
            this.setMessage("The tree burns to ash, opening a path east");
        }
    }

    cut(target) {
        const roomId = this.gameData.roomId;
        const state = this.gameData.states;
        switch (target) {
            case "vines":
                this.setState("vine", 1);
                this.setItemRoom("vines", roomId);
                this.setMessage("The vines fall to the ground");
                break;
            case "whale":
                const whaleState = state.whale;
                if (whaleState === 0) {
                    this.setState("whale", 1);
                    this.setItemRoom("grease", roomId);
                    this.setMessage("You slice open the whale, revealing grease.");
                } else {
                    this.setMessage("Better not risk it again, the Red Hot Chili Peppers might see you.");
                }
                break;
            default:
                this.setMessage("You can't cut that");
        }
    }

    put(target) {
        const parts = target.split(" ");
        target = parts[0];
        const obj = parts[parts.length - 1];
        const state = this.gameData.states;
        const roomId = this.gameData.roomId;
        switch (target) {
            case "vines":
                if (roomId === 15) {
                    this.setState("vinehook", 1);
                    this.setItemRoom("vines", 99);
                    this.setMessage("The vines connect to the hook, allowing a passage up");
                }
                break;
            case "dynamite":
                if (roomId === 24) {
                    if (obj === "fire") {
                        this.setMessage("The dynamite blows up, sending you and the hut sky-high!");
                        this.died();
                    }
                    if (obj === "kiln") {
                        if (state.kiln === 0) {
                            this.setMessage("The kiln isn't active. The firewood isn't burning");
                        } else {
                            if (state.wetbomb === 1) {
                                this.setMessage("The kiln dries out the dynamite, making it useable");
                                this.setState("wetbomb", 0);
                            } else {
                                this.setMessage("The dynamite is already dried. At this point you're literally playing with fire");
                            }
                        }
                    }
                } else if (roomId === 11) {
                    if (state.wetbomb === 1) {
                        this.setMessage("The dynamite is damp and cannot be lit");
                    } else {
                        this.setMessage("The boulder is blown to smithereens, revealing a path west");
                        this.setState("boulder", 1);
                        this.setItemRoom("dynamite", 99);
                    }
                }
                break;
            default:
                this.setMessage("You can't put that");
        }
    }

    restart() {
        this.setState("restart", 1);
        this.setState("gameover", 0);
    }

    died() {
        const message = this.gameData.dialogMessage;
        this.setMessage(`${message}<br/><br/>YOU DIED!`);
        this.setState("gameover", 1);
    }


    doAction(action, target) {
        switch (action) {
            case "restart":
                this.restart();
                break;
            case "push":
                this.push(target);
                break;
            case "pull":
                this.pull(target);
                break;
            case "get":
                this.take(target);
                break;
            case "drop":
                this.drop(target);
                break;
            case "burn":
                this.burn(target);
                break;
            case "examine":
                this.examine(target);
                break;
            case "cut":
                this.cut(target);
                break;
            case "put":
                this.put(target);
                break;
            default:
                console.log(`Unknown action ${action}.`);
        }
        return { ...this.gameData };
    }

    setMessage(text) {
        this.gameData.dialogMessage = text;
    }
}
export default Game;