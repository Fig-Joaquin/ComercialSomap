import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Persona } from '../entities/personaEntity';
import { Cliente } from '../entities/clienteEntity';
import { Comuna } from '../entities/comunaEntity';
import { ZodValidatorAdapter } from '../plugins/zod-cliente-plugin';
import { personaSchemaRegistro, clienteSchema } from '../schemas';
import logger from '../utils/logger';

// * Crear un cliente
export const createPersonaCliente = async (req: Request, res: Response) => {
  const personaAdapter = new ZodValidatorAdapter(personaSchemaRegistro);
  const clienteAdapter = new ZodValidatorAdapter(clienteSchema);

  const parsePersonaResult = personaAdapter.validateAndSanitize(req.body.persona);
  if (!parsePersonaResult.success) {
    return res.status(400).json({ message: 'Invalid input for persona', errors: parsePersonaResult.errors });
  }

  const parseClienteResult = clienteAdapter.validateAndSanitize(req.body.cliente);
  if (!parseClienteResult.success) {
    return res.status(400).json({ message: 'Invalid input for cliente', errors: parseClienteResult.errors });
  }

  const { rut_persona, nombre, primer_apellido, segundo_apellido, email, telefono } = parsePersonaResult.data;
  const { direccion, nombre_local, razon_social, giro, id_comuna } = parseClienteResult.data;

  try {
    const personaRepository = AppDataSource.getRepository(Persona);
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const comunaRepository = AppDataSource.getRepository(Comuna);

    const existingPersona = await personaRepository.findOne({ where: { rut_persona } });
    if (existingPersona) {
      return res.status(409).json({ message: 'Persona already exists' });
    }

    const existingCliente = await clienteRepository.findOne({ where: { persona: { rut_persona } } });
    if (existingCliente) {
      return res.status(409).json({ message: 'Cliente already exists' });
    }

    const existingComuna = await comunaRepository.findOne({ where: { id_comuna } });
    if (!existingComuna) {
      return res.status(404).json({ message: 'Comuna not found' });
    }

    const newPersona = personaRepository.create({
      rut_persona,
      nombre,
      primer_apellido,
      segundo_apellido: segundo_apellido || '',
      email: email || '',
      telefono,
    });
    await personaRepository.save(newPersona);

    const newCliente = clienteRepository.create({
      persona: newPersona,
      comuna: existingComuna,
      direccion,
      nombre_local,
      razon_social,
      giro,
      mora: false,
    });
    await clienteRepository.save(newCliente);

    res.status(201).json({ persona: newPersona, cliente: newCliente });
  } catch (err) {
    logger.error('Error creating PersonaCliente: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


// //* Crear cliente dada a que existe una persona en la base de datos
// export const createClienteWithExistingPersona = async (req: Request, res: Response) => {
//   const clienteAdapter = new ZodValidatorAdapter(clienteSchema);

//   // Validar datos del cliente
//   const parseClienteResult = clienteAdapter.validateAndSanitize(req.body.cliente);

//   if (!parseClienteResult.success) {
//     return res.status(400).json({ message: 'Invalid input for cliente', errors: parseClienteResult.errors });
//   }

//   const { ID_Persona, Direccion, Nombre_Local, Razon_Social, Giro, ID_Comuna } = parseClienteResult.data;

//   try {
//     const personaRepository = AppDataSource.getRepository(Persona);
//     const clienteRepository = AppDataSource.getRepository(Cliente);
//     const comunaRepository = AppDataSource.getRepository(Comuna);

//     // Verificar si la persona existe
//     const existingPersona = await personaRepository.findOne({ where: { ID_Persona } });
//     if (!existingPersona) {
//       return res.status(404).json({ message: 'Persona not found' });
//     }

//     // Verificar si ya existe un cliente con la misma persona
//     const existingCliente = await clienteRepository.findOne({
//       where: { Persona: existingPersona }
//     });
//     if (existingCliente) {
//       return res.status(409).json({ message: 'Cliente already exists for this persona' });
//     }

//     // Verificar si la comuna existe
//     const existingComuna = await comunaRepository.findOne({ where: { ID_Comuna } });
//     if (!existingComuna) {
//       return res.status(404).json({ message: 'Comuna not found' });
//     }

//     // Crear y guardar el nuevo cliente
//     const newCliente = clienteRepository.create({
//       Persona: existingPersona, // Asociar correctamente la persona
//       Comuna: existingComuna,
//       Direccion,
//       Nombre_Local,
//       Razon_Social,
//       Giro,
//       Mora: false
//     });
//     await clienteRepository.save(newCliente);

//     res.status(201).json({ cliente: newCliente });
//   } catch (err) {
//     logger.error('Error creating Cliente with existing Persona: %o', err);
//     if (err instanceof Error) {
//       res.status(500).json({ message: err.message });
//     } else {
//       res.status(500).json({ message: 'An unknown error occurred' });
//     }
//   }
// };



//* Eliminar un cliente
export const deleteClienteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    logger.error('id is missing from the request parameters');
    return res.status(400).json({ message: 'id is required' });
  }

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({ where: { id_cliente: Number(id) } });

    if (!cliente) {
      logger.warn('Cliente not found for id: %s', id);
      return res.status(404).json({ message: 'Cliente not found' });
    }

    await clienteRepository.remove(cliente);

    res.status(200).json({ message: 'Cliente deleted successfully' });
  } catch (err) {
    logger.error('Error deleting Cliente by id: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


// * Obtener todos los clientes
export const getClientes = async (req: Request, res: Response) => {
  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const clientes = await clienteRepository.find({ relations: ["persona", "comuna"] });

    res.status(200).json(clientes);
  } catch (err) {
    logger.error('Error fetching Clientes: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const filterClientes = async (req: Request, res: Response) => {
  const { direccion, nombre_local, razon_social, giro, mora, id_comuna } = req.query;

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const queryBuilder = clienteRepository.createQueryBuilder("cliente")
      .leftJoinAndSelect("cliente.persona", "persona")
      .leftJoinAndSelect("cliente.comuna", "comuna");

    if (direccion) {
      queryBuilder.andWhere("cliente.direccion LIKE :direccion", { direccion: `%${direccion}%` });
    }
    if (nombre_local) {
      queryBuilder.andWhere("cliente.nombre_local LIKE :nombre_local", { nombre_local: `%${nombre_local}%` });
    }
    if (razon_social) {
      queryBuilder.andWhere("cliente.razon_social LIKE :razon_social", { razon_social: `%${razon_social}%` });
    }
    if (giro) {
      queryBuilder.andWhere("cliente.giro LIKE :giro", { giro: `%${giro}%` });
    }
    if (mora !== undefined) {
      queryBuilder.andWhere("cliente.mora = :mora", { mora: mora === 'true' });
    }
    if (id_comuna) {
      queryBuilder.andWhere("comuna.id_comuna = :id_comuna", { id_comuna });
    }

    const clientes = await queryBuilder.getMany();
    res.status(200).json(clientes);
  } catch (err) {
    logger.error('Error filtering clientes: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


// * Obtener un cliente por su RUT
export const getClienteByRut = async (req: Request, res: Response) => {
  const { rut } = req.params;

  if (!rut) {
    logger.error('rut is missing from the request parameters');
    return res.status(400).json({ message: 'Rut is required' });
  }

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({
      where: { persona: { rut_persona: rut.toLowerCase() } },
      relations: ["persona", "comuna"]
    });

    if (!cliente) {
      logger.warn('Cliente not found for rut: %s', rut);
      return res.status(404).json({ message: 'Cliente not found' });
    }

    res.status(200).json(cliente);
  } catch (err) {
    logger.error('Error fetching cliente by rut: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


// * Obtener un cliente por su ID
export const getClienteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    logger.error('id is missing from the request parameters');
    return res.status(400).json({ message: 'id is required' });
  }

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const cliente = await clienteRepository.findOne({
      where: { id_cliente: Number(id) }, // Ajuste a minúsculas
      relations: ["persona", "comuna"] // Relaciones en minúsculas
    });

    if (!cliente) {
      logger.warn('Cliente not found for id: %s', id);
      return res.status(404).json({ message: 'Cliente not found' });
    }

    res.status(200).json(cliente);
  } catch (err) {
    logger.error('Error fetching cliente by id: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};


//* Actualizar cliente
export const updateClienteByRut = async (req: Request, res: Response) => {
  const { rut } = req.params;

  const partialClienteSchema = clienteSchema.partial(); // Permitir actualizaciones parciales
  const clienteAdapter = new ZodValidatorAdapter(partialClienteSchema);

  const parseClienteResult = clienteAdapter.validateAndSanitize(req.body);
  if (!parseClienteResult.success) {
    return res.status(400).json({ message: 'Invalid input for cliente', errors: parseClienteResult.errors });
  }

  const { direccion, nombre_local, razon_social, giro, mora, id_comuna } = parseClienteResult.data;

  try {
    const clienteRepository = AppDataSource.getRepository(Cliente);
    const comunaRepository = AppDataSource.getRepository(Comuna);

    const cliente = await clienteRepository.findOne({
      where: { persona: { rut_persona: rut } }, // Ajuste a minúsculas
      relations: ["comuna", "persona"] // Relaciones en minúsculas
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente not found' });
    }

    if (direccion !== undefined) cliente.direccion = direccion;
    if (nombre_local !== undefined) cliente.nombre_local = nombre_local;
    if (razon_social !== undefined) cliente.razon_social = razon_social;
    if (giro !== undefined) cliente.giro = giro;
    if (mora !== undefined) cliente.mora = mora;

    if (id_comuna !== undefined) {
      const existingComuna = await comunaRepository.findOne({ where: { id_comuna } }); // Ajuste a minúsculas
      if (!existingComuna) {
        return res.status(404).json({ message: 'Comuna not found' });
      }
      cliente.comuna = existingComuna;
    }

    await clienteRepository.save(cliente);

    res.status(200).json(cliente);
  } catch (err) {
    logger.error('Error updating cliente: %o', err);
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
