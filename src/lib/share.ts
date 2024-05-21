import type { GameData } from "~/lib/types";
import { decode, encode } from "@msgpack/msgpack";

export const serialize = (data: GameData) => {
  const obj = {
    b: data.defaultBuyIn,
    p: data.players.map((p) => ({
      n: p.name,
      c: p.color,
      i: p.status === "in",
      b: p.bought,
      z: p.cashed,
    })),
    l: data.log.map((e) => ({
      t: e.type === "buyIn" ? 0 : 1,
      p: e.playerId,
      a: e.amount,
    })),
  };

  const encoded = encode(obj);
  const binString = Array.from(encoded, (byte) => String.fromCodePoint(byte)).join("");

  return btoa(binString);
};

export const deserialize = (data: string) => {
  const encoded = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  const obj = decode(encoded);

  return {
    defaultBuyIn: obj.b,
    players: obj.p.map((p) => ({
      name: p.n,
      color: p.c,
      status: p.i ? "in" : "out",
      bought: p.b,
      cashed: p.z,
    })),
    log: obj.l.map((e) => ({
      type: e.t === 0 ? "buyIn" : "cashOut",
      playerId: e.p,
      amount: e.a,
    })),
  };
};
