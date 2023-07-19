
const modifyRole = async (userId) => {
  try {
    const result = await fetch(`/api/v1/user/premium/`+ userId, {
      method: "GET"
    });
    alert("Rol de usuario modificado")
    window.location.href = `admin/user/${userId}`;
  } catch (error) {
    alert(error)
  }
}

const deleteUser = async (userId) => {
  try {
    const result = await fetch(`/api/v1/user/`+ userId, {
      method: "DELETE"
    });
    if(result && result.status == 200) {
      alert("Usuario Eliminado")
      window.location.href = `admin`;
    }
  } catch (error) {
    alert(error)
  }
}