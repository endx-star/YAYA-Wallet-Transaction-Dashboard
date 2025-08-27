import { Injectable, InternalServerErrorException } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { buildSignature } from "./signing.util";
import { YaYaListResponse, YaYaSearchBody } from "./yayawallet.types";

@Injectable()
export class YaYaWalletService {
  private client: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.baseUrl = process.env.YAYA_BASE_URL || "http://localhost:4000";
    this.apiKey = process.env.YAYA_API_KEY || "";
    this.apiSecret = process.env.YAYA_API_SECRET || "";
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10_000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private signHeaders(method: string, endpoint: string, bodyString: string) {
    const timestamp = Date.now().toString(); // ms since epoch (UTC)
    const signature = buildSignature({
      timestamp,
      method,
      endpoint,
      bodyString,
      apiSecret: this.apiSecret,
    });
    return {
      "YAYA-API-KEY": this.apiKey,
      "YAYA-API-TIMESTAMP": timestamp,
      "YAYA-API-SIGN": signature,
    };
  }

  async findByUser(page = 1): Promise<YaYaListResponse> {
    const endpoint = "/api/en/transaction/find-by-user";
    const method = "GET";
    const url = `${endpoint}?p=${page}`; // querystring not included in signature by spec example
    const headers = this.signHeaders(method, endpoint, "");
    try {
      const { data } = await this.client.get(url, { headers });
      return data as YaYaListResponse;
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.response?.data || e?.message || "YaYa find-by-user failed"
      );
    }
  }

  async search(query: string, page = 1): Promise<YaYaListResponse> {
    const endpoint = "/api/en/transaction/search";
    const method = "POST";
    const body: YaYaSearchBody = { query, p: page };
    const bodyString = JSON.stringify(body);
    const headers = this.signHeaders(method, endpoint, bodyString);
    try {
      const { data } = await this.client.post(endpoint, bodyString, {
        headers,
      });
      return data as YaYaListResponse;
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.response?.data || e?.message || "YaYa search failed"
      );
    }
  }
}
