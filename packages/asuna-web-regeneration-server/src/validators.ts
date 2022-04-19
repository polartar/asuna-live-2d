import Ajv, { JSONSchemaType } from 'ajv'
import { TokenId, TraitType } from 'asuna-data'
const ajv = new Ajv({ $data: true })

export interface InventoryParams {
  address: string
}

export interface WalletParams {
  address: string
}

export interface DepositBody {
  address: string,
  tokenIds: number[]
}

export interface WithdrawBody {
  address: string,
  tokenIds: number[]
}

export interface SwapBody {
  tokenId1: TokenId
  tokenId2: TokenId
  traitTypes: TraitType[]
}

const InventoryQuerySchema: JSONSchemaType<InventoryParams> = {
  type: 'object',
  properties: {
    address: { type: 'string', pattern: '^0x([0-9a-fA-F])*$', minLength: 42, maxLength: 42, nullable: false }
  },
  required: ['address'],
  additionalProperties: false
}

const WalletQuerySchema: JSONSchemaType<WalletParams> = {
  type: 'object',
  properties: {
    address: { type: 'string', pattern: '^0x([0-9a-fA-F])*$', minLength: 42, maxLength: 42, nullable: false }
  },
  required: ['address'],
  additionalProperties: false
}

const DepositBodySchema: JSONSchemaType<DepositBody> = {
  type: 'object',
  properties: {
    address: { type: 'string', pattern: '^0x([0-9a-fA-F])*$', minLength: 42, maxLength: 42, nullable: false },
    tokenIds: {
      type: 'array',
      uniqueItems: true,
      items: { type: 'integer', minimum: 0, maximum: 9999 },
      minItems: 1,
      maxItems: 200,
    }
  },
  required: ['address', 'tokenIds'],
  additionalProperties: false
}

const WithdrawBodySchema: JSONSchemaType<WithdrawBody> = {
  type: 'object',
  properties: {
    address: { type: 'string', pattern: '^0x([0-9a-fA-F])*$', minLength: 42, maxLength: 42, nullable: false },
    tokenIds: {
      type: 'array',
      uniqueItems: true,
      items: { type: 'integer', minimum: 0, maximum: 9999 },
      minItems: 1,
      maxItems: 200,
    }
  },
  required: ['address', 'tokenIds'],
  additionalProperties: false
}

const SwapBodySchema: JSONSchemaType<SwapBody> = {
  type: 'object',
  properties: {
    tokenId1: { type: 'integer', minimum: 0, maximum: 9999, nullable: false },
    tokenId2: {
      type: 'integer',
      minimum: 0,
      maximum: 9999,
      nullable: false,
      exclusiveMinimum: { $data: '1/tokenId1' } as any
    },
    traitTypes: {
      type: 'array',
      uniqueItems: true,
      items: { type: 'integer', minimum: 0, maximum: 18 },
      minItems: 1,
      maxItems: 19
    }
  },
  required: ['tokenId1', 'tokenId2', 'traitTypes'],
  additionalProperties: false
}

export default {
  validateInventoryParams: ajv.compile(InventoryQuerySchema),
  validateWalletParams: ajv.compile(WalletQuerySchema),
  validateDepositBody: ajv.compile(DepositBodySchema),
  validateWithdrawBody: ajv.compile(WithdrawBodySchema),
  validateSwapBody: ajv.compile(SwapBodySchema)
}
