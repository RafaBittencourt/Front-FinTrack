// const adminPermissions = {
//   leads: true,
//   oportunidades: true,
//   usuarios: true,
//   createLead: true,
//   editLead: true,
//   leadHistory: true,
//   transferLead: true,
//   createOportunidade: true,
//   editOportunidade: true,
//   seeAllOportunidade: true,
//   createUsuarios: true,
//   editUsuarios: true,
//   tipoUsuario: [
//     {
//       value: '0',
//       display: 'Master',
//     },
//     {
//       value: '1',
//       display: 'Diretor',
//     },
//     {
//       value: '2',
//       display: 'Gerente',
//     },
//     {
//       value: '3',
//       display: 'Executivo',
//     },
//     {
//       value: '4',
//       display: 'Executivo Base',
//     },
//     {
//       value: '5',
//       display: 'Gerente Canais',
//     },
//     {
//       value: '6',
//       display: 'Gerente Base',
//     },
//     {
//       value: '7',
//       display: 'Pre Venda Consultor',
//     },
//   ],
// }

// const diretorPermissions = {
//   leads: true,
//   oportunidades: true,
//   usuarios: true,
//   createLead: true,
//   editLead: true,
//   leadHistory: true,
//   transferLead: true,
//   createOportunidade: true,
//   editOportunidade: true,
//   seeAllOportunidade: true,
//   createUsuarios: true,
//   editUsuarios: true,
//   tipoUsuario: [
//     {
//       value: '1',
//       display: 'Diretor',
//     },
//     {
//       value: '2',
//       display: 'Gerente',
//     },
//     {
//       value: '3',
//       display: 'Executivo',
//     },
//     {
//       value: '4',
//       display: 'Executivo Base',
//     },
//     {
//       value: '5',
//       display: 'Gerente Canais',
//     },
//     {
//       value: '6',
//       display: 'Gerente Base',
//     },
//     {
//       value: '7',
//       display: 'Pre Venda Consultor',
//     },
//   ],
// }

// const gerentePermissions = {
//   leads: true,
//   oportunidades: true,
//   usuarios: true,
//   createLead: true,
//   editLead: true,
//   leadHistory: true,
//   transferLead: true,
//   createOportunidade: true,
//   editOportunidade: true,
//   createUsuarios: true,
//   editUsuarios: true,
//   tipoUsuario: [
//     {
//       value: '3',
//       display: 'Executivo',
//     },
//     {
//       value: '7',
//       display: 'Pre Venda Consultor',
//     },
//   ],
// }

// const executivoPermissions = {
//   leads: true,
//   oportunidades: true,
//   usuarios: false,
//   createLead: true,
//   editLead: true,
//   leadHistory: false,
//   transferLead: false,
//   createOportunidade: true,
//   editOportunidade: true,
//   createUsuarios: false,
//   editUsuarios: false,
//   tipoUsuario: [],
// }

// const gerenteBasePermissions = {
//   leads: true,
//   oportunidades: true,
//   usuarios: true,
//   createLead: true,
//   editLead: true,
//   leadHistory: true,
//   transferLead: true,
//   createOportunidade: true,
//   editOportunidade: true,
//   createUsuarios: true,
//   editUsuarios: true,
//   tipoUsuario: [
//     {
//       value: '4',
//       display: 'Executivo Base',
//     },
//   ],
// }

// const executivoBasePermissions = {
//   leads: true,
//   oportunidades: true,
//   usuarios: false,
//   createLead: true,
//   editLead: true,
//   leadHistory: false,
//   transferLead: false,
//   createOportunidade: true,
//   editOportunidade: true,
//   createUsuarios: false,
//   editUsuarios: false,
//   tipoUsuario: [],
// }

// const gerenteCanaisPermissions = {
//   leads: true,
//   oportunidades: true,
//   usuarios: true,
//   createLead: true,
//   editLead: true,
//   leadHistory: true,
//   transferLead: true,
//   createOportunidade: true,
//   editOportunidade: true,
//   createUsuarios: true,
//   editUsuarios: true,
//   tipoUsuario: [
//     {
//       value: '1',
//       display: 'Diretor',
//     },
//     {
//       value: '2',
//       display: 'Gerente',
//     },
//     {
//       value: '3',
//       display: 'Executivo',
//     },
//     {
//       value: '4',
//       display: 'Executivo Base',
//     },
//     {
//       value: '5',
//       display: 'Gerente Canais',
//     },
//     {
//       value: '6',
//       display: 'Gerente Base',
//     },
//     {
//       value: '7',
//       display: 'Pre Venda Consultor',
//     },
//   ],
// }

// const preVendaConsultorPermissions = {
//   leads: true,
//   oportunidades: false,
//   usuarios: false,
//   createLead: false,
//   editLead: false,
//   leadHistory: false,
//   transferLead: false,
//   createOportunidade: false,
//   editOportunidade: false,
//   createUsuarios: false,
//   editUsuarios: false,
//   tipoUsuario: [],
// }

// export function switchPermissions(userType: string) {
//   switch (userType) {
//     case 'Admin':
//       return adminPermissions
//     case 'Diretor':
//       return diretorPermissions
//     case 'Gerente':
//       return gerentePermissions
//     case 'GerenteBase':
//       return gerenteBasePermissions
//     case 'GerenteCanais ':
//       return gerenteCanaisPermissions
//     case 'Executivo':
//       return executivoPermissions
//     case 'ExecutivoBase':
//       return executivoBasePermissions
//     case 'PreVendaConsultor':
//       return preVendaConsultorPermissions
//     default:
//       return executivoPermissions
//   }
// }

// export function CheckedPermission(permission: string){
//     const { permissions, userId, loading, tipoLicenca } = useUserData()
// }