import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class HttpClient {
    private static _instance: HttpClient;
    private _client: AxiosInstance;

    private constructor() {
        this._client = axios.create({
            baseURL: "",
        });

        this._client.interceptors.request.use((config) => {
            return config;
        });
    }

    public static getInstance() {
        if (!HttpClient._instance) {
            HttpClient._instance = new HttpClient();
        }

        return HttpClient._instance;
    }

    public async get<T>(
        path: string,
        configs?: AxiosRequestConfig
    ): Promise<T> {
        return (await this._client.get(path, configs)).data;
    }

    public async post<T, R = void>(
        path: string,
        body: T,
        configs?: AxiosRequestConfig
    ): Promise<R> {
        return (await this._client.post(path, body, configs)).data;
    }

    public async put<T, R = void>(
        path: string,
        body: T,
        configs?: AxiosRequestConfig
    ): Promise<R> {
        return (await this._client.put(path, body, configs)).data;
    }

    public async patch<T, R = void>(
        path: string,
        body: T,
        configs?: AxiosRequestConfig
    ): Promise<R> {
        return (await this._client.patch(path, body, configs)).data;
    }

    public async delete<T>(
        path: string,
        configs?: AxiosRequestConfig
    ): Promise<T> {
        return (await this._client.delete(path, configs)).data;
    }
}
