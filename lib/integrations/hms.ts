/**
 * 100ms.live integration — live classroom rooms with hand-raise, breakouts,
 * polls, and recording.
 *
 * STATUS: Stub. Mock mode returns a deterministic room URL so the live
 * classroom UI can be built and tested without a 100ms account.
 *
 * To go live: set HMS_ACCESS_KEY + HMS_SECRET + HMS_TEMPLATE_ID, install the
 * 100ms server SDK + @100mslive/react-sdk on the client, and replace TODOs.
 */

const MOCK = !process.env.HMS_ACCESS_KEY || !process.env.HMS_SECRET;

export type CreateRoomInput = {
  liveSessionId: string;
  title: string;
};

export type Room = {
  roomId: string;
  roomUrl: string;
};

export type AuthToken = {
  token: string;
  role: "host" | "guest";
  expiresIn: number;
};

export const hms = {
  isMock: MOCK,

  async createRoom(input: CreateRoomInput): Promise<Room> {
    if (MOCK) {
      const id = `room-${input.liveSessionId.slice(0, 8)}`;
      return {
        roomId: id,
        roomUrl: `/dashboard/live/${input.liveSessionId}`, // in mock mode, our own UI handles the room
      };
    }
    // TODO: const room = await hmsClient.rooms.create({...});
    throw new Error("100ms SDK not implemented yet.");
  },

  /** Returns a JWT scoped to a single user joining a single room. */
  async generateAuthToken(
    roomId: string,
    userId: string,
    role: "host" | "guest",
  ): Promise<AuthToken> {
    if (MOCK) {
      return {
        token: `mock.${roomId}.${userId}.${role}`,
        role,
        expiresIn: 3600,
      };
    }
    // TODO: signed JWT using HMS_SECRET
    throw new Error("100ms token signing not implemented yet.");
  },

  /** Trigger a server-side recording start. */
  async startRecording(_roomId: string) {
    if (MOCK) return { recordingId: `mock-rec-${Date.now()}` };
    throw new Error("100ms recording not implemented yet.");
  },
};
