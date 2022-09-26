import * as borsh from '@project-serum/borsh'

export class Discussion {
    comment: string;

    constructor(comment: string) {
        this.comment = comment;
    }

    static mocks: Discussion[] = [
        new Discussion('test comment 1'),
        new Discussion('test comment 2'),
    ]

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('comment'),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.str('comment'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): Discussion | null {
        if (!buffer) {
            return null
        }

        try {
            const { comment } = this.borshAccountSchema.decode(buffer)
            return new Discussion(comment)
        } catch (e) {
            console.log('Deserialization error:', e)
            console.log(buffer)
            return null
        }
    }
}