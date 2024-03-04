import { Socket } from "socket.io";
import { Entity, EntityForm } from "../class/Entity";
import { PhysicalEntity, PhysicalEntityForm } from "../class/PhysicalEntity";
import { JudiciaryEntity, JudiciaryEntityForm } from "../class/JudiciaryEntity";
import { entity as include } from "../prisma/include";

const register = async (
  socket: Socket,
  data: EntityForm & {
    physical_data?: PhysicalEntityForm;
    judiciary_data?: JudiciaryEntityForm;
  }
) => {
  const entity_prisma = await Entity.register(data);

  if (data.physical_data) {
    const entity = new PhysicalEntity(entity_prisma.id);
    const fullData = await entity.register(data.physical_data); // Assuming similar changes for PhysicalEntity
    socket.emit("entity:registration:success", fullData);
  } else if (data.judiciary_data) {
    const entity = new JudiciaryEntity(entity_prisma.id);
    const fullData = await entity.register(data.judiciary_data);
    socket.emit("entity:registration:success", fullData);
  }
};

// Jeito Fernando
//   const entity_prisma = await Entity.register(data);

//   let entity: PhysicalEntity | JudiciaryEntity | null = null;

//   if (data.physical_data) {
//     entity = new PhysicalEntity(entity_prisma.id);
//     const fullData = await entity.register(data.physical_data);
//   } else if (data.judiciary_data) {
//     entity = new JudiciaryEntity(entity_prisma.id);
//     const fullData = await entity.register(data.judiciary_data);
//   }

//   socket.emit("entity:registration:success", entity_prisma);
// };

export default { register };
