import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import './App.css'

interface Card {
    index   : number;
    number  : number;
    suit    : 'trump' | 'wands' | 'swords' | 'cups' | 'pentacles';
    name    : string;
    image   : string;
};

const queryClient = new QueryClient();

// const isLocal = window.location.host.includes('local');
const isLocal = false;
const protocol = isLocal ? 'http://' : 'https://';
const host = isLocal ? 'localhost:8000' : 'raw.ic0.app';
const canister = (window as any).canister;
const token = (window as any).token;

function App() {
    return (
        <div className="App">
            <QueryClientProvider client={queryClient}>
                <DeckPage canister={canister} index={token} />
            </QueryClientProvider>
        </div>
    )
};

function DeckPage(props : {index : number, canister : string}) {
    const url = `${protocol}${canister}.${host}`;
    const { isLoading, error, data } = useQuery(`deck${props.index}`, () =>
        fetch(`${url}/manifest/${props.index}`).then(res =>
            res.json() as unknown as Card[]
        )
    );
    return isLoading
        ? <>Loading...</>
        : error
            ? <>Error!</>
            : <DeckGrid url={url} cards={data as Card[]} />;
};

function DeckGrid (props : {cards : Card[], url : string}) {
    return <div className="card-grid">
        {props.cards.map(card => <div className="card">
            <div className="card-title">#{card.number} {card.name}</div>
            <img className="card-image" src={`${props.url}${card.image}`} />
        </div>)}
    </div>
};

export default App
