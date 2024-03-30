import stump from "../assets/stump.png";
import matches from "../assets/matches.png";
import dynamite from "../assets/dynamite.png";
import knife from "../assets/knife.png";
import vines from "../assets/vines.png";
import grease from "../assets/grease.png";
import fire from "../assets/fire.gif";
import boulder from "../assets/boulder.png";
import cart from "../assets/cart.png";
import hole from "../assets/hole.png";
import oars from "../assets/oars.png";
import oar from "../assets/oar.png";
import rip from "../assets/rip.png";
import lever from "../assets/lever.png";
import panel from "../assets/leverpanel.png";

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
        if (roomId === 13) { return state.lever }
        if (roomId === 15) { return state.vinehook }
        if (roomId === 21) { return state.whale }
        if (roomId === 24) { return state.kiln }
        if (roomId === 30) { return (state.cart < 2) ? 0 : 1 }
        if (roomId === 32) { return (state.cart === 2) ? 1 : 0 }
        if (roomId === 33) { return state.canvas }
        if (roomId === 36) { return (this.getItemRoom("lever") === roomId) ? 0 : 1 }
        if (roomId === 37) { return state.oars }
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
        if (roomId === 13 && states.lever === 1) {
            things.push(<img src={panel} key={key++} className="Panel" alt="panel"></img>); 
        }
        if (roomId === 30 && states.cart < 2) {
            things.push(<img src={cart} key={key++} className="Cart" alt="cart"></img>);
        }
        if (roomId === 30 && states.cart > 1) {
            things.push(<img src={hole} key={key++} className="Hole" alt="hole"></img>);
        }
        if (roomId === 32 && states.cart > 1) {
            things.push(<img src={cart} key={key++} className="CartNorth" alt="cart"></img>);
        }
        if (roomId === 33 && states.canvas === 1) {
            things.push(<img src={rip} key={key++} className="Rip" alt="rip"></img>);
        }
        if (roomId === 37 && states.oars === 1) {
            things.push(<img src={oar} key={key++} className="Oar" alt="oar"></img>);
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
                    things.push(<img src={grease} key={key++} className="Grease" alt="grease"></img>);
                }
                if (item.name === "oars") {
                    things.push(<img src={oars} key={key++} className="Oars" alt="oars"></img>);
                }
                if (item.name === "lever") {
                    things.push(<img src={lever} key={key++} className="Lever" alt="lever"></img>);
                }
            }
        }
        return things;
    }

    getActions() {
        const roomId = this.gameData.roomId;
        const state = this.gameData.states;
        const items = this.gameData.items;
        var actions = [];
        var key = 0;
        if (state.gameover === 1) {
            return [{ action: "restart", target: "game", key: key++ }];
        }

        if (roomId < 4) {
            actions.push({ action: "examine", target: "sand", key: key++ });
        }

        switch (roomId) {
            case 1:
                actions.push({ action: "examine", target: "sea", key: key++ });
                break;
            case 4:
                if (state.tree === 0) {
                    if (this.carrying("matches")) {
                        actions.push({ action: "burn", target: "tree", key: key++ });
                    }
                    actions.push({ action: "examine", target: "tree", key: key++ });
                }
                break;
            case 5:
                if (state.vine === 0) {
                    actions.push({ action: "examine", target: "vines", key: key++ });
                    if (this.carrying("knife")) {
                        actions.push({ action: "cut", target: "vines", key: key++ });
                    }
                }
                break;
            case 6:
                if (state.boards === 0) {
                    if (state.pullboards === 1) {
                        actions.push({ action: "pull", target: "boards", key: key++ });
                    }
                    actions.push({ action: "examine", target: "boards", key: key++ });
                }
                break;
            case 7:
                actions.push({ action: "examine", target: "wall", key: key++ });
                break;
            case 11:
                if (state.boulder === 0) {
                    actions.push({ action: "examine", target: "boulder", key: key++ });
                    if (this.carrying("dynamite")) {
                        actions.push({ action: "put", target: "dynamite under boulder", key: key++ });
                    }
                }
                break;
            case 13:
                actions.push({ action: "examine", target: "machine", key: key++ });
                if (state.lever === 0) {
                    if (this.carrying("lever")) {
                        actions.push({ action: "put", target: "lever in hole", key: key++ });
                    }
                    actions.push({ action: "examine", target: "panel", key: key++ });
                    actions.push({ action: "examine", target: "hole", key: key++ });
                }
                break;
            case 15:
                actions.push({ action: "examine", target: "hook", key: key++ });
                if (this.carrying("vines")) {
                    actions.push({ action: "put", target: "vines on hook", key: key++ });
                }
                break;
            case 17:
                actions.push({ action: "examine", target: "human", key: key++ });
                break;
            case 21:
                actions.push({ action: "examine", target: "whale", key: key++ });
                if (this.carrying("knife")) {
                    actions.push({ action: "cut", target: "whale", key: key++ });
                }
                break;
            case 23:
                actions.push({ action: "examine", target: "hut", key: key++ });
                break;
            case 24:
                actions.push({ action: "examine", target: "hut", key: key++ });
                actions.push({ action: "examine", target: "kiln", key: key++ });
                if (state.kiln === 0) {
                    actions.push({ action: "examine", target: "firewood", key: key++ });
                    if (this.carrying("matches")) {
                        actions.push({ action: "burn", target: "firewood", key: key++ });
                    }
                } else if (this.carrying("dynamite")) {
                    actions.push({ action: "put", target: "dynamite in fire", key: key++ });
                }
                if (this.carrying("dynamite")) {
                    actions.push({ action: "put", target: "dynamite in kiln", key: key++ });
                }
                break;
            case 28:
                actions.push({ action: "pull", target: "plug", key: key++ });
                actions.push({ action: "examine", target: "plug", key: key++ });
                break;
            case 30:
                if (state.cart === 0) {
                    actions.push({ action: "examine", target: "cart", key: key++ });
                }
                if (state.greasecart === 1 && this.carrying("grease")) {
                    actions.push({ action: "put", target: "grease on wheels", key: key++ });
                }
                if (state.cart < 2) {
                    actions.push({ action: "push", target: "cart", key: key++ });
                    actions.push({ action: "pull", target: "cart", key: key++ });
                }
                break;
            case 32:
                if (state.cart === 2) {
                    actions.push({ action: "push", target: "cart", key: key++ });
                    actions.push({ action: "pull", target: "cart", key: key++ });
                }
                break;
            case 33:
                actions.push({ action: "examine", target: "canvas", key: key++ });
                if (this.carrying("matches")) {
                    actions.push({ action: "burn", target: "canvas", key: key++ });
                }
                if (this.carrying("knife") && state.canvas === 0) {
                    actions.push({ action: "cut", target: "canvas", key: key++ });
                }
                break;
            case 36:
                actions.push({ action: "examine", target: "cord", key: key++ });
                actions.push({ action: "pull", target: "cord", key: key++ });
                break;
            case 37:
                actions.push({ action: "examine", target: "boat", key: key++ });
                if (this.carrying("oars") || state.oars === 1) {
                    actions.push({ action: "put", target: "oars on boat", key: key++ });
                }
                break;
            default:
                break;
        }

        for (var i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.roomId === roomId) {
                actions.push({ action: "get", target: item.name, key: key++ });
                actions.push({ action: "examine", target: item.name, key: key++ });
            }
            if (item.roomId === 0) {
                actions.push({ action: "drop", target: item.name, key: key++ });
                actions.push({ action: "examine", target: item.name, key: key++ });
            }
        }
        return actions;
    }


    getGroupedActions() {
        var grouped = {};
        const actions = this.getActions();
        for (var i = 0; i < actions.length; i++) {
            const action = actions[i];
            const name = action.action;
            const target = action.target;
            if (name in grouped) {
                grouped[name].push(target);
            } else {
                grouped[name] = [target];
            }
        }
        return grouped;
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
        if (roomId === 38) { this.won() }
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
            case "sea":
                this.setMessage("You've no chance of escape without a boat");
                break;
            case "tree":
                this.setMessage("It is very old, musty and dry looking");
                break;
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
            case "cart":
                if (state.cart === 0) {
                    this.setMessage("The wheels are seized with rust");
                    this.setState("greasecart", 1);
                }
                break;
            case "canvas":
                this.setMessage("It is quite thick");
                break;
            case "oars":
                this.setMessage("Put these on a boat!");
                break;
            case "lever":
                this.setMessage("Looks like it was taken from a machine");
                break;
            case "cord":
                this.setMessage("Part of some contraption");
                break;
            case "sand":
                this.setMessage("It could become a 6502 someday");
                break;
            case "hole":
                this.setMessage("Looks like it has a missing piece");
                break;
            case "machine":
                this.setMessage("It has been here a long time but looks functional");
                break;
            case "panel":
                this.setMessage("If opened, you could fit through the hole");
                break;
            case "boat":
                this.setMessage("It could be your salvation!");
                break;
            default:
                this.setMessage("You can't examine that");
        }
    }

    push(target) {
        const state = this.gameData.states;
        const roomId = this.gameData.roomId;
        switch (target) {
            case "cart":
                if (roomId === 30 && state.cart === 0) {
                    this.setMessage("The wheels are seized with rust. They need lubricant");
                    this.setState("greasecart", 1);
                }
                if (roomId === 30 && state.cart === 1) {
                    this.setMessage("The cart rolls into the room north of you. A hole under the cart is revealed, leading down");
                    this.setState("cart", 2);
                }
                if (roomId === 32) {
                    this.setMessage("Can't push it any further, but you could pull");
                }
                break;
            default:
                this.setMessage("You can't push that");
        }
    }

    pull(target) {
        const state = this.gameData.states;
        const roomId = this.gameData.roomId;
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
            case "cart":
                if (roomId === 32 && state.cart === 2) {
                    this.setMessage("The cart rolls back south");
                    this.setState("cart", 1)
                }
                if (roomId === 30 && state.cart === 1) {
                    this.setMessage("Can't pull it any further, but you could push");
                }
                if (roomId === 30 && state.cart === 0) {
                    this.setMessage("The wheels are seized with rust. They need lubricant");
                    this.setState("greasecart", 1);
                }
                break;
            case "cord":
                this.setMessage("A trapdoor opens, you fall into a chute!");
                this.setState("chute", 1);
                break;
            default:
                this.setMessage("You can't pull that");
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
            case "canvas":
                this.setMessage("The canvas erupts into flames! It falls over you, burning you to a crisp!");
                this.died();
                break;
            default:
                this.setMessage("You can't burn that");
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
            case "canvas":
                this.setMessage("You slice open the canvas, making a pathway up");
                this.setState("canvas", 1);
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
                        const matches = state.matches - 1;
                        this.setState("matches", matches);
                    }
                }
                break;
            case "grease":
                if (roomId === 30) {
                    this.setMessage("You grease up the cart's wheels, you should be able to push or pull it now");
                    this.setState("cart", 1);
                    this.setItemRoom("grease", 99);
                }
                break;
            case "lever":
                this.setMessage("The lever causes the panel to slide open, revealing an eastern passage");
                this.setItemRoom("lever", 99);
                this.setState("lever",1);
                break;
            case "oars":
                if (state.oars === 0 ) {
                    this.setMessage("You install the oars on the boat, you can now row north");
                    this.setItemRoom("oars", 99);
                    this.setState("oars",1);
                } else {
                    this.setMessage("They're already installed. Go north, young man");
                }
                break;
            default:
                this.setMessage("You can't put that there");
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

    won() {
        this.setMessage("You get picked up by the crew of Whale Wars<br/>(You don't tell them where you got the grease)<br/>They take you back home");
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