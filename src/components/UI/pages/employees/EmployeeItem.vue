<template>
<tr>
<th>{{ name }}</th>
<th>{{ email }}</th>
<th>{{ phone }}</th>
<th>{{ dob }}</th>
<th>{{ department }}</th>
<th>{{ joiningDate }}</th>
</tr>
</template>

<script>
export default {
    props:['name','email','phone','dob','department','joiningDate']
}
</script>
