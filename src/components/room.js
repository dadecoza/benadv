import './room.css';
import Game from '../helpers/game';
import Button from './button';
import Dialog from "./dialog";
import React, { useState, useEffect } from 'react';

function Room({ props }) {
    const [message, setMessage] = useState("");
    const [action, setAction] = useState("");
    const [itemButtons, setItemButtons] = useState([]);

    const game = new Game(props.gameData);
    const room = game.getRoom();
    const groupedActions = game.getGroupedActions();
    const gameover = props.gameData.states.gameover;
    const roomText = room.text;
    const moveRoom = (roomId) => {
        props.setGameData(game.setRoom(roomId));
        setAction("");
    };
    const doAction = (action, target) => {
        const update = game.doAction(action, target);
        props.setGameData(update);
        setAction("");
    };
    const handleCraiyon = () => {
        setMessage("the developer was too cheap to remove the Craiyon watermark!");
    };
    const handleDialogClose = () => {
        setMessage("");
        setAction("");
        game.setMessage("");
        if (game.gameData.states.chute === 1) { // a little hacky
            game.setState("chute", 0);
            game.setRoom(30);
            props.setGameData({ ...game.gameData });
        }
    };
    const directionButtons = (() => {
        var buttons = [];
        const directions = room.directions;
        for (var i = 0; i < directions.length; i++) {
            const direction = directions[i];
            const comma = (i === directions.length - 1) ? "" : ",";
            buttons.push(<Button key={direction.key} onClick={() => moveRoom(direction.roomId)}>{direction.label}{comma}</Button>)
        }
        return (<div className="ButtonContainer">{buttons}</div>);
    })();

    const actionButtons = (() => {
        var buttons = [];
        const keys = Object.keys(groupedActions);
        for (var i = 0; i < keys.length; i++) {
            const value = keys[i];
            const comma = (i === keys.length - 1) ? "" : ",";
            buttons.push(<Button key={i} onClick={() => { setItemButtons(groupedActions[value]); setAction(value); }}>{value}{comma}</Button>);
        }
        return buttons;
    })();
    const canvas = (() => {
        var things = game.getThings();
        return (
            <div className="Room-image" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/craiyon/${room.roomId}.png')` }} >
                {things}
                <div className="Craiyon" onClick={handleCraiyon} />
            </div>
        );
    })();
    useEffect(() => {
        if (props.gameData.dialogMessage.length > 0) {
            setMessage(props.gameData.dialogMessage);
            setAction("");
        }
    }, [props.gameData]);
    return (
        <div className='Room'>
            {canvas}
            <div className='Description'>
                <div>{room.description}</div>
                <div style={{ marginTop: "10px" }}>{roomText}</div>
            </div>
            <div className='Controls'>
                {(gameover === 0) &&
                    <div className="DirectionContainer">
                        <div className="ControlTitle">Exits lead:</div>
                        {directionButtons}
                    </div>
                }
                {(actionButtons.length > 0) &&
                    <div className="DirectionContainer">
                        <div className="ControlTitle">You can {action}:</div>
                        {(action === "") ? <div className="ButtonContainer">{actionButtons}</div> :
                            <div>{(itemButtons || []).map((item) => (
                                <Button key={item} onClick={() => doAction(action, item)}>{`${item},`}</Button>
                            ))}
                                <Button key="back" onClick={() => setAction("")}>back</Button>
                            </div>
                        }
                    </div>
                }
            </div>
            <Dialog props={{ visible: (message.length > 0), onClose: handleDialogClose }}>{message}</Dialog>
        </div>
    );
}
export default Room;