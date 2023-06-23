
export class JanusClient {

    private _connection: Record<string, any>;
    private _session: Record<string, any>;

    public constructor(connection?: Record<string, any>, session?: Record<string, any>) {
        this._connection = connection || {};
        this._session = session || {};
    }

    public static of(connection: Record<string, any>, session: Record<string, any>): JanusClient {
        return new JanusClient(connection, session);
    }

    get connection(): Record<string, any> {
        return this._connection;
    }

    set connection(value: Record<string, any>) {
        this._connection = value;
    }

    get session(): Record<string, any> {
        return this._session;
    }

    set session(value: Record<string, any>) {
        this._session = value;
    }
}