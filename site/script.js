const app = new Vue ({
    el: '#app',
    data: {
        nameSearch: '',
        companySearch: '',
        people: null,
        loading: true
    },
    computed: {
        filteredList() {
            return (!!this.people) ? this.people.filter(person => {
                return person.nome.toLowerCase().includes(this.nameSearch.toLowerCase()) &&
                       person.empresa.toLowerCase().includes(this.companySearch.toLowerCase())
            }) : []
        },
    },
    mounted: function (){
        axios.get('/results.json')
            .then(response => {this.people = response.data})
            .finally(() => {this.loading = false});
    }
});