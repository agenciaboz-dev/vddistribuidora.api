import { Socket } from "socket.io"
import { Entity, EntityForm } from "../class/Entity"
import { PhysicalEntity, PhysicalEntityForm } from "../class/PhysicalEntity"
import { JudiciaryEntity } from "../class/JudiciaryEntity"

const register = async (socket: Socket, data: EntityForm & { physical_data?: PhysicalEntityForm }) => {
    const entity_prisma = await Entity.register(data)

    let entity: PhysicalEntity | JudiciaryEntity | null = null

    if (data.physical_data) {
        entity = new PhysicalEntity(entity_prisma.id)
        await entity.register(data.physical_data)
    } else {
        // a mesma coisa pro judiciario
    }

    socket.emit("taltalatl", entity)
}

export default { register }
