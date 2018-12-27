import React, {Component, Fragment} from 'react';
import {Container, Row, Col, Collapse, Button, ButtonGroup, Modal, ModalHeader, Popover, PopoverBody,
        ModalBody, ModalFooter, Input, Card, CardBody, CardFooter, Media} from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {Helmet} from 'react-helmet';

import {download} from './shared_map.js'
import {Cent, doNetRequest, player_icons, get_random_loader, PickupSelect, get_param} from './common.js'
import SiteBar from "./SiteBar.js";

import 'react-notifications/lib/notifications.css';

const textStyle = {color: "black", textAlign: "center"}
const nicePartNames = {
        "ActivateTeleporter": {
        "sunkenGlades": "Sunken Glades",
        "moonGrotto": "Moon Grotto",
        "mangroveFalls": "Blackroot Burrows",
        "valleyOfTheWind": "Sorrow Pass",
        "spiritTree": "Hollow Grove",
        "mangroveB": "Lost Grove",
        "horuFields": "Horu Fields",
        "ginsoTree": "Ginso Tree",
        "forlorn": "Forlorn Ruins",
        "mountHoru": "Mount Horu",
        "swamp": "Thornfelt Swamp",
        "sorrowPass": "Valley of the Wind"
    },
    "DieTo": {
        "NoobSpikes": "Sorrow Spike Maze"
    },

    "HuntEnemies": {
        "Upper Ginso Miniboss": "Ginso (Upper)",
        "Lower Ginso Miniboss": "Ginso (Lower)",
        "Swamp Rhino Miniboss": "Stomp Area Rhino",
    },
    "GetItemAtLoc": {
        "LostGroveLongSwim" : "Lost Grove Swim AC",
        "ValleyEntryGrenadeLongSwim": "Valley Long Swim",
        "SpiderSacEnergyDoor" : "Spider Energy Door",
        "SorrowHealthCell" : "Sorrow HC",
        "SunstonePlant" : "Sunstone Plant",
        "GladesLaser" : "Gladzer EC",
        "LowerBlackrootLaserAbilityCell": "BRB Right Laser AC",
        "MistyGrenade" : "Misty Grenade EX",
        "LeftSorrowGrenade": "Sorrow Grenade EX",
        "DoorWarpExp" : "Door Warp EX",
        "HoruR3Plant" : "R3 Plant",
        "RightForlornHealthCell" : "Right Forlorn HC",
        "ForlornEscapePlant" : "Forlorn Escape Plant"
    }
}
const getCardContent = (card, activePlayer) => {
    let {name, type, progress} = card;
    let prog = progress[activePlayer] || {completed: false, noData: true};
    let text = name, help = "", extraLines = []
    try {
        let optionNames = []
        switch(type) {
            case "bool":
                switch(name) {
                    case "FastStompless":
                        text = "Fast Stompless"
                        help = "Break the rocks above Kuro's head in the Valley of the Wind with a long-distance spider shot"
                    break;
                    case "CoreSkip":
                        text = "Core Skip"
                        help = "Skip one of the Ginso core rooms by destroying both sets of brambles with a well-timed level-up."
                    break;
                    case "DrownFrog":
                        text = "Drown an amphibian"
                        help = "The amphibians native to Nibel are fronkeys, red spitters, and green spitters"
                    break;
                    case "DrainSwamp":
                        text = "Drain the Swamp"
                        help = "Drain the pool in the area above and to the right of the Grotto Teleporter by breaking the blue barrier there."
                    break;
                    case "WilhelmScream":
                        text = "Make Wilhelm Scream"
                        help = "Throw Wilhelm (a green spitter on the top left cliff in the main Valley of the Wind room) off his cliff. Note: Wilhelm does not spawn unless you have the Sunstone."
                    break;
                    default:
                        text = name;
                        help = "???";
                    break;
                }
            break;
            case "int":
                optionNames.push({partName: `(${prog.noData ? '' : Math.min(prog.count, card.target)+"/"}${card.target})`, fake: true})
                switch(name) {
                    case "CollectMapstones":
                        text = `Collect mapstones`
                        help = "You do not need to turn them in."
                        break;
                    case "ActivateMaps":
                        text = `Activate map altars`
                        help = "There are map altars in every zone besides Misty and Ginso"
                        break;
                    case "OpenKSDoors":
                        text = `Open keystone doors`
                        help = "In Open Mode, the already-opened door in Sunken Glades will not count."
                        break;
                    case "OpenEnergyDoors":
                        text = `Open energy doors`
                        help = "There are 2 energy doors in Grotto, 2 in Glades, 1 in Grove, and 1 in Sorrow."
                        break;
                    case "BreakFloors":
                        text = `Break floors or ceilings`
                        help = "A floor or ceiling is a horizontal barrier that can be broken with a skill."
                        break;
                    case "BreakWalls":
                        text = `Break walls`
                        help = "A wall is a vertical barrier that can be broken with a skill."
                        break;
                    case "UnspentKeystones":
                        text = `Keystones in inventory`
                        help = "Keyduping is allowed, and you can spend your keys after completing this goal."
                        break;
                    case "BreakPlants":
                        text = `Break plants`
                        help = "Plants are the large blue bulbs that can only be broken with Charge Flame, Grenade, or Charge Dash"
                        break;
                    case "TotalPickups":
                        text = `Collect pickups`
                        help = "This includes petrified plants, mapstone turnins, world events, and horu rooms."
                        break;
                    case "UnderwaterPickups":
                        text = `Collect underwater pickups`
                        help = "Pickups are considered underwater if they are submerged or in an area only reachable by swimming."
                        break;
                    case "HealthCells":
                        text = `Collect Health Cells`
                        help = "Any bonus health cells you spawn with will not count."
                        break;
                    case "EnergyCells":
                        text = `Collect Energy Cells`
                        help = "Any bonus energy cells you spawn with will not count."
                        break;
                    case "AbilityCells":
                        text = `Collect Ability Cells`
                        help = "Any bonus ability cells you spawn with will not count."
                        break;
                    case "HealthCellLocs":
                        text = `Get pickups from Health Cells`
                        help = "Collect pickups from this many vanilla health cell locations."
                        break;
                    case "EnergyCellLocs":
                        text = `Get pickups from Energy Cells`
                        help = "Collect pickups from this many vanilla energy cell locations."
                        break;
                    case "AbilityCellLocs":
                        text = `Get pickups from Ability Cells`
                        help = "Collect pickups from this many vanilla ability cell locations."
                        break;
                    case "MapstoneLocs":
                        text = `Get pickups from Mapstones`
                        help = "Collect pickups from this many vanilla mapstone locations."
                        break;
                    case "LightLanterns":
                        text = `Light Lanterns`
                        help = "The lanterns in the pre-dash area of Blackroot Burrows do not count."
                        break;
                    case "SpendPoints":
                        text = `Spend Ability Points`
                        help = "What you spend them on is up to you."
                        break;
                    case "GainExperience":
                        text = `Gain spirit light`
                        help = "bonus experience gained from the Spirit Light Efficiency ability counts."
                        break;
                    case "KillEnemies":
                        text = `Kill enemies`
                        help = "Large swarms count as 3 enemies (the initial swarm and the first split)."
                        break;
                    default:
                       break;
                }
            break;
            case "multi":
                let infix = "", suffix = ":"
                if(card.parts)
                {
                    if(nicePartNames.hasOwnProperty(name))
                        optionNames = card.parts.map(part => {return {niceName: nicePartNames[name][part.name] || part.name, partName: part.name}})
                    else
                        optionNames = card.parts.map(part => {return {partName: part.name}})
                }
                let plural = card.parts && card.parts.length > 1
                switch(card.method) {
                    case "and":
                        infix = card.parts.length > 1 ? ( card.parts.length > 2 ? "THESE " : "BOTH ") : "this "
                        break;
                    case "or":
                        infix = card.parts.length > 1 ? ( card.parts.length > 2 ? "ANY " : "EITHER ") : "this "
                        if(card.parts.length === 2)
                            plural = false;
                        break;
                    case "count":
                        optionNames.push({partName: `(${prog.noData ? '' : Math.min(prog.count, card.target)+"/"}${card.target})`, fake: true})
                        plural = card.target > 1;
                        suffix=""
                        break;
                    default:
                        break;
                }
                let s = plural ? "s" : ""
                let es = plural ? "es" : ""
                let yies = plural ? "ies" : "y"
                switch(name) {
                    case "CompleteHoruRoom":
                        text = `Complete ${infix}Horu room${s+suffix}`
                        help = "A room is completed when the 'lava drain' animation plays."
                    break;
                    case "CompleteEscape":
                        text = `Escape ${infix}dungeon${s+suffix}`
                        help = "The Ginso escape is completed when you recieve Clean Water (or the item there). The other two are are position-based."
                    break;
                    case "ActivateTeleporter":
                        text = `Activate ${infix}spirit well${s+suffix}`
                        help = "Both manual activation (by walking onto the well) and activation via teleporter pickup counts."
                    break;
                    case "EnterArea":
                        text = `Enter ${infix}area${s+suffix}`
                        help = "Entering via warps or teleporters is allowed"
                    break;
                    case "GetItemAtLoc":
                        text = `Get ${infix}pickup${s+suffix}`
                        help = "It doesn't matter what the item itself is."
                    break;
                    case "VisitTree":
                        text = `Visit ${infix}tree${s+suffix}`
                        help = "Tree refers to a skill tree, or more specifically a location where a skill is gained. (Kuro's feather counts as a skill tree.)"
                    break;
                    case "GetAbility":
                        text = `Level up ${infix}abilit${yies+suffix}`
                        help = "AP requirements: Ultra defense: 19, Spirit Light Efficiency: 10, Ultra Stomp: 10"
                    break;
                    case "GetEvent":
                        text = `Unlock ${infix}event${s+suffix}`
                        if(card.method === "count")
                            help = "The events are the 3 dungeon keys and Clean Water, Wind Restored, and Warmth Returned"
                        else
                            help = "Note that in vanilla, half the events require one of the other events as a pre-requisite"
                    break;
                    case "StompPeg":
                        text = `Stomp ${infix}post${s+suffix}`
                        help = "Posts must be stomped in completely to be counted"
                    break;
                    case "HuntEnemies":
                        text = `Defeat ${infix}Miniboss${es+suffix}`
                        if(card.method === "count")
                            help = "The minibosses are: the Fronkey Fight (don't skip it!), the Lost Grove fight room, the Grotto miniboss, the Misty miniboss, the two Ginso minibosses, the Rhino below the stomp tree, and the Horu final Miniboss"
                        else
                            help = "A miniboss encounter is defeated when all the enemies involved are killed. In most cases, a purple door will open."
                    break;
                    case "VanillaEventLocs":
                        text = `Visit ${infix}event location${s+suffix}`
                        help = "The event locations are where the 3 dungeon keys and Clean Water, Wind Restored, and Warmth Returned are obtained in vanilla"
                    break;
                    case "DieTo":
                        text = `Die to ${infix}thing${s+suffix}`
                        help = "Saving to avoid losing your pickups is recommended"
                    break;
                    default:
                        break;
                    }
                break;
            default:
                break;
        }
        extraLines = optionNames.map(({partName, niceName, fake}) =>
        {
            fake = fake || false
            niceName = niceName || partName
            let styles = {};
            if(!fake)
                {
                let lineCompleted = prog.hasOwnProperty("completedParts") && prog.completedParts.includes(partName)
                if(lineCompleted) {
                    if(prog.completed) 
                        styles.background = "#8f8"
                    else
                        styles.background = "#cfc"
                }
            }
            return <div className="w-100" style={styles}>{niceName}</div>
        })
        let i = 0;
        text = [text].concat(extraLines).map(t => (<div className="w-100" key={`card-line-${i++}`}>{t}</div>))
    }
    catch(error)
    {
        console.log(error, card, activePlayer)
    }
    return {text: text, help: help, completed: prog.completed}
}

const make_icons = players => players.map(p => (<Media key={`playerIcon${p}`} object style={{width: "25px", height: "25px"}} src={player_icons(p, false)} alt={"Icon for player "+p} />))
const BingoCard = ({text, players, tinted, help}) => {
    let className = "px-0 pb-0 justify-content-center text-center align-items-center d-flex " + ((text.length > 1) ? "pt-0 flex-column" : "pt-1")
    let cardStyles = {width: '18vh', height: '18vh', minWidth: '120px', maxWidth: '160px', minHeight: '120px', maxHeight: '160px', flexGrow: 1}
    let {helpText, open, toggle, i} = help
    let helpLink = null, popover = null
    if(helpText) {
        helpLink = (
            <div className="m-0 p-0 float-left"><Button color="link" className="pl-1 pt-1 pb-0 pr-0 m-0" id={"help-"+i} onClick={toggle}>?</Button></div>
            )
        popover = (
            <Popover placement="top" isOpen={open} target={"help-"+i} toggle={toggle}>
            <PopoverBody>{helpText}</PopoverBody>
            </Popover>
        )
    }
    
    if(tinted)
        cardStyles.background = "#cfc"
    return (
        <Card style={cardStyles}>
                <CardBody style={{fontSize: "1.5vh",}} className={className}>
                    <b>{text}</b>
                </CardBody>
                <CardFooter className="p-0 text-center">
                {helpLink}
                {popover}
                {make_icons(players)}
                </CardFooter>
        </Card>

)}

// board: rows[cols[players]]
const bingos = (board, players) => {
    let ret = {}
    let dim = board.length
    players.forEach(p => {
        ret[p] = [];
        try {
            let tlbr = true, bltr = true;
            for(let i = 0; i < dim; i++) {
                tlbr = tlbr && board[i][i].includes(p);
                bltr = bltr && board[dim-i-1][i].includes(p);
                if(board[i].every(card => card.includes(p)))
                    ret[p].push(`row ${i+1}`)
                if(board.every(col => col[i].includes(p)))
                    ret[p].push(`col ${i+1}`)
            }
            if(tlbr) ret[p].push("tlbr")
            if(bltr) ret[p].push("bltr")
        } catch(error) {
            console.log(error, board)
        }

    })
    return ret;
}

class BingoBoard extends Component {
    constructor(props) {
        super(props);
        let {cards} = props
        this.state = {helpOpen: cards.map(_ => false)}
    }
    helpToggle = (cardNum) => () => this.setState(prev => {
        console.log(cardNum)
        prev.helpOpen[cardNum]  = !prev.helpOpen[cardNum]
        return {helpOpen: prev.helpOpen}
    })
    render() {
        let {cards, activePlayer} = this.props
        if(!cards || cards.length < 25) {
            return null
        }
        let rows = [], i = 0;
        while(rows.length < 5) {
            let row = []
            while(row.length < 5) {
                let card = cards[i];
                let {text, help, completed} = getCardContent(card, activePlayer);
                let players = Object.keys(card.progress).filter(p => card.progress[p].completed);
                row.push((<td key={i}><BingoCard tinted={completed} help={{i: i, helpText: help, open: this.state.helpOpen[i], toggle: this.helpToggle(i)}} text={text} players={players} /></td>))
                i++
            }
            rows.push((<tr key={`row-${rows.length}`}>{row}</tr>))
        }
        return (<table><tbody>{rows}</tbody></table>);
    }

}

const PlayerList = ({playerData, bingos, activePlayer, onClickName}) => {
    let players = Object.keys(playerData).map(p => {
        let number = (bingos[p] && bingos[p].length) || 0
        let text = (<span>{playerData[p].name} ({number})</span>) 
        if(activePlayer+"" === p)
            text = (<b>{text}</b>)
        return [number, (
            <Row key={`player-list-${p}`} className="pl-3 text-center pt-1">
                <Col className="p-0 pl-1" xs="auto">
                    <Cent>{make_icons([p])}</Cent>
                </Col>
                <Col className="p-0 pr-1" xs="auto">
                    <Button color="link" onClick={onClickName(p)}>{text}</Button>
                </Col>
            </Row>
        )]
    });
    players = players.sort((a, b) => b[0] - a[0]).map(p => p[1])

    return (
        <Fragment>
            <Row className="pl-3
             text-center pt-1"><h4>Players</h4></Row>
            {players}
        </Fragment>
    );
}

export default class Bingo extends React.Component {
    constructor(props) {
        super(props);
        let url = new URL(window.document.location.href);
        let view_only = url.href.includes("bingo/spectate")
        let gameId = parseInt(url.searchParams.get("game_id") || -1, 10);
        this.state = {cards: [], haveGame: false, creatingGame: false, createModalOpen: true, playerData: {}, activePlayer: 1, showInfo: false, bingos: {}, user: get_param("user"), loading: true,
                      fails: 0, gameId: gameId, startSkills: 3, startCells: 4, startMisc: "MU|TP/Swamp/TP/Valley", start_with: "", difficulty: "normal", isRandoBingo: false, randoGameId: -1, view_only: view_only};
        if(gameId > 0)
        {
            let url = `/bingo/game/${gameId}/fetch`
            doNetRequest(url, this.createCallback)
            this.state.haveGame = true
            this.state.createModalOpen = false
            this.state.loader = get_random_loader()
        }
    }
    componentWillMount() {
        this.tick()
        this.interval = setInterval(() => this.tick(), 5000);
  };
    updateUrl = () => {
        let {gameId} = this.state;
        let url = window.document.URL.split("?")[0];
        if(gameId && gameId > 0)
            url += `?game_id=${gameId}`
        window.history.replaceState('',window.document.title, url);
    }

    joinGame = () => {
        let {gameId, seed, activePlayer, haveGame} = this.state;
        if(!haveGame) return;
        let nextPlayer = activePlayer;
        let players = Object.keys(this.state.playerData)
        while(players.includes("" + nextPlayer))
            nextPlayer++;

        seed = `Sync${gameId}.${nextPlayer},` + seed
        download("randomizer.dat", seed)
        this.setState({activePlayer: nextPlayer})
        doNetRequest(`/bingo/game/${gameId}/add/${nextPlayer}`, this.tickCallback)
    }
    tick = () => {
        let {gameId, haveGame} = this.state;
        if(gameId && gameId > 0 && haveGame && this.state.fails < 50)
        {
            doNetRequest(`/bingo/game/${gameId}/fetch`, this.tickCallback)
        }
    }
    tickCallback = ({status, responseText}) => {
        if(status !== 200)
        {
            if((this.state.fails - 1) % 5 === 0)
                NotificationManager.error(`error ${status}: ${responseText}`, "error", 5000)
            this.setState({fails: this.state.fails + 1})
        } else {
            let res = JSON.parse(responseText)
            this.updatePlayerProgress(res.playerData)
        }
    }
    onClickName = (player) => () => {
        this.setState({activePlayer: player})
    }
    createGame = () => {
        let {isRandoBingo, randoGameId, startSkills, startCells, startMisc, showInfo, difficulty} = this.state;
        if(isRandoBingo)
        {
            let url = `/bingo/from_game/${randoGameId}?difficulty=${difficulty}`
            doNetRequest(url, this.createCallback)
            this.setState({creatingGame: true, createModalOpen: false, loader: get_random_loader()})
        } else {
            let url = `/bingo/new?skills=${startSkills}&cells=${startCells}&misc=${startMisc}&difficulty=${difficulty}`
            if(showInfo)
                url += "&showInfo=1"
            doNetRequest(url, this.createCallback)
            this.setState({creatingGame: true, createModalOpen: false, loader: get_random_loader()})
        }
    }
    createCallback = ({status, responseText}) => {
        if(status !== 200)
        {
            NotificationManager.error(`error ${status}: ${responseText}`, "error creating seed", 5000)
            this.setState({createModalOpen: false, haveGame: false, creatingGame: false}, this.updateUrl)
            return
        } else {
            let res = JSON.parse(responseText)
            this.setState({startWith: res.startWith, gameId: res.gameId, createModalOpen: false, creatingGame: false, haveGame: true, fails: 0, dispDiff: res.difficulty || this.state.difficulty,
                          seed: res.seed, playerData: res.playerData, cards: res.cards.map(card => {return {progress: {}, ...card}})}, this.updateUrl)
        }
    }

    updatePlayerProgress = (playerData) => {
        let cards = [...this.state.cards];
        let col = 0, row = 0, board = [[]]
        cards.forEach(card => {
            let {name, type} = card;
            card.progress = {}
            Object.keys(playerData).forEach(p => {
                let prog = {'completed': false}
                if((playerData[p].hasOwnProperty("bingoData") && playerData[p].bingoData.hasOwnProperty(name)))
                {
                    let cardData = playerData[p].bingoData[name]
                    switch(type) {
                        case "bool":
                            prog.completed = cardData.value;
                            break;
                        case "int":
                            prog.count = cardData.value;
                            prog.completed = prog.count >= card.target;
                            break;
                        case "multi":
                            switch(card.method) {
                                case "and":
                                    prog.completedParts = card.parts.filter(part => cardData.value[part.name].value).map(part => part.name);
                                    prog.completed = card.parts.length === prog.completedParts.length;
                                    break;
                                case "or":
                                    prog.completedParts = card.parts.filter(part => cardData.value[part.name].value).map(part => part.name);
                                    prog.completed = prog.completedParts.length > 0;
                                    break;
                                case "count":
                                    prog.count = cardData.total;
                                    prog.completed = prog.count >= card.target;
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    prog.noData = true
                }
                card.progress[p] = prog
            })
            board[row][col] = Object.keys(card.progress).filter(p => card.progress[p].completed)
            col++
            if(col > 4) {
                col = 0; row++
                board.push([])
            }
        })
        board.pop()
        let newState = {playerData: playerData, fails: 0, cards: cards, bingos: bingos(board, Object.keys(playerData))} 
        if(this.state.loading) {
            newState.loading = false;
            Object.keys(playerData).forEach(p => {
                if(playerData[p].name === this.state.user)
                    newState.activePlayer = parseInt(p, 10);
            })
        }
        this.setState(newState)
    }

    toggleCreate = () => this.setState({createModalOpen: !this.state.createModalOpen})

    render = () => {
        if(this.state.view_only)
            return this.renderSpectate()
        
        let {activePlayer, playerData, startWith, cards, haveGame, bingos, gameId, user, dispDiff} = this.state
        let headerText = haveGame && dispDiff ? `Bingo Game ${gameId} (${dispDiff})` : "Bingo!"
        let subheader = (haveGame && startWith !== "") ? (
            <Row>
                <Col>
                    <Cent><h6 style={textStyle}>{startWith}</h6></Cent>
                </Col>
            </Row>
        ) : null
        let bingoContent = haveGame ? (
            <Row className="align-items-center">
                <Col><BingoBoard cards={cards} activePlayer={activePlayer}/></Col>
                <Col><PlayerList playerData={playerData} bingos={bingos} activePlayer={activePlayer} onClickName={this.onClickName}/></Col>
            </Row>
            ) : null
        return (
            <Container className="pl-4 pr-4 pb-4 pt-2 mt-2 w-75">
                <Helmet>
                    <style>{'body { background-color: white}'}</style>
                </Helmet>
                <NotificationContainer/>
                <SiteBar user={user}/>
                {this.createModal()}
                {this.loadingModal()}
                <Row className="p-1">
                    <Col>
                        <Cent><h3 style={textStyle}>{headerText}</h3></Cent>
                    </Col>
                </Row>
                {subheader}
                <Row className="align-items-center pt-1 pb-1">
                    <Col xs="auto">
                        <Button block color="primary" onClick={this.toggleCreate}>Create New Game</Button>
                    </Col><Col xs="auto">
                        <Button block onClick={this.joinGame} disabled={!haveGame}>Join Game / Download Seed</Button>
                    </Col><Col xs="auto">
                        <Row className="align-items-left py-0 px-1 m-0">
                            <Col xs="auto">
                            <Cent>
                                Player:
                            </Cent>
                            </Col>
                            <Col xs="5"><Cent>
                                <Input type="number" disabled={!haveGame} min="1" value={activePlayer} onChange={(e) => this.setState({activePlayer: parseInt(e.target.value, 10)})}/>
                            </Cent></Col>
                            <Col xs="auto">
                            <Cent>
                                {activePlayer > 0 ? make_icons([activePlayer]) : null}
                            </Cent>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {bingoContent}
                <Row className="align-items-center">
                    <small> spectator link: {window.document.location.href.replace("board", "spectate")}</small>
                </Row>
            </Container>
        )
    }
    renderSpectate = () => {
        let {activePlayer, playerData, startWith, cards, haveGame, bingos, dispDiff, gameId} = this.state
        let headerText = haveGame && dispDiff ? `Bingo Game ${gameId} (${dispDiff})` : "Game not found"
        let subheader = (haveGame && startWith !== "") ? (
            <Row>
                <Col>
                    <Cent><h6 style={textStyle}>{startWith}</h6></Cent>
                </Col>
            </Row>
        ) : null
        let bingoContent = haveGame ? (
            <Row className="align-items-center">
                <Col><BingoBoard cards={cards} activePlayer={activePlayer}/></Col>
                <Col><PlayerList playerData={playerData} bingos={bingos} activePlayer={activePlayer} onClickName={this.onClickName}/></Col>
            </Row>
            ) : null
        return (
            <Container className="pl-4 pr-4 pb-4 pt-2 mt-2 w-100">
                <Helmet>
                    <style>{'body { background-color: white}'}</style>
                </Helmet>
                <NotificationContainer/>
                <Row className="p-1">
                    <Col>
                        <Cent><h3 style={textStyle}>{headerText}</h3></Cent>
                    </Col>
                </Row>
                {subheader}
                {bingoContent}
            </Container>
        )
    }
    loadingModal = () => { return (
        <Modal size="sm" isOpen={this.state.creatingGame } backdrop={"static"} className={"modal-dialog-centered"}>
            <ModalHeader centered="true">Please wait...</ModalHeader>
            <ModalBody>
                <Container fluid>
                    <Row className="p-2 justify-content-center align-items-center">
                        <Col xs="auto" className="align-items-center justify-content-center p-2">{this.state.loader}</Col>
                    </Row>
                </Container>
            </ModalBody>
        </Modal>
    )}
    createModal = () =>  { return (
        <Modal size="lg" isOpen={this.state.createModalOpen} backdrop={"static"} className={"modal-dialog-centered"} toggle={this.toggleCreate}>
            <ModalHeader toggle={this.toggleCreate} centered="true">Bingo options</ModalHeader>
            <ModalBody>
                <Container fluid>
                    <Row className="p-1">
                        <Col xs="4" className="p1 border">
                            <Cent>Difficulty</Cent>
                        </Col><Col xs="6">
                            <ButtonGroup>
                                <Button active={this.state.difficulty === "easy"} outline={this.state.difficulty !== "easy"} onClick={() => this.setState({difficulty: "easy"})}>Easy</Button>
                                <Button active={this.state.difficulty === "normal"} outline={this.state.difficulty !== "normal"} onClick={() =>this.setState({difficulty: "normal"})}>Normal</Button>
                                <Button active={this.state.difficulty === "hard"} outline={this.state.difficulty !== "hard"} onClick={() => this.setState({difficulty: "hard"})}>Hard</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row className="p-1">
                        <Col xs="4" className="p-1 border">
                            <Cent>Bingo Type</Cent>
                        </Col>
                        <Col xs="6">
                            <ButtonGroup>
                                <Button active={!this.state.isRandoBingo} outline={this.state.isRandoBingo} onClick={() => this.setState({isRandoBingo: false})}>Vanilla+</Button>
                                <Button active={this.state.isRandoBingo} outline={!this.state.isRandoBingo} onClick={() => this.setState({isRandoBingo: true})}>Rando</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Collapse isOpen={this.state.isRandoBingo}>
                        <Row className="p-1">
                            <Col xs="12" className="text-center p-1">
                                <Cent>Please generate a normal rando seed and input the game id below. (Don't download the generated seed! Use the join game link on this page)</Cent>
                            </Col>
                            <Col xs="4" className="text-center p-1 border">
                                <Cent>Rando Game ID</Cent>
                            </Col><Col xs="4">
                                <Input type="number" value={this.state.randoGameId}  onChange={(e) => this.setState({randoGameId: parseInt(e.target.value, 10)})}/>
                            </Col>
                        </Row>
                    </Collapse>
                    <Collapse isOpen={!this.state.isRandoBingo}>
                        <Row className="p-1">
                            <Col xs="4" className="text-center p-1 border">
                                <Cent>Random Free Skill Count</Cent>
                            </Col><Col xs="4">
                                <Input type="number" value={this.state.startSkills}  onChange={(e) => this.setState({startSkills: parseInt(e.target.value, 10)})}/>
                            </Col>
                        </Row>
                        <Row className="p-1">
                            <Col xs="4" className="p-1 border">
                                <Cent>Random Free Cell Count</Cent>
                            </Col><Col xs="4">
                                <Input type="number" value={this.state.startCells} onChange={(e) => this.setState({startCells: parseInt(e.target.value, 10)})}/>
                            </Col>
                        </Row>
                        <Row className="p-1">
                            <Col xs="4" className="text-center p-1 border">
                                <Cent>Additional Pickups</Cent>
                            </Col><Col xs="8">
                                <PickupSelect value={this.state.startMisc} updater={(code, _) => this.setState({startMisc: code})}/>
                            </Col>
                        </Row>
                        <Row className="p-1">
                            <Col xs="4" className="text-center pt-1 border">
                                <Cent>Random Starting Items</Cent>
                            </Col><Col xs="4">
                                <ButtonGroup>
                                    <Button active={this.state.showInfo} outline={!this.state.showInfo} onClick={() => this.setState({showInfo: true})}>Show</Button>
                                    <Button active={!this.state.showInfo} outline={this.state.showInfo} onClick={() => this.setState({showInfo: false})}>Hide</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Collapse>
                </Container>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={this.createGame}>Create Game</Button>
                <Button color="secondary" onClick={this.toggleCreate}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )}
};
