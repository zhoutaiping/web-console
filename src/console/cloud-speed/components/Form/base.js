import { addReserved } from '@/utils/form'
import SELECT from '../../constant/select'

export default {
  props: {
    isBatch: Boolean
  },

  data() {
    return {
      addReserved,
      SELECT,
      form: {}
    }
  },

  created() {
    this.setForm()
  },

  methods: {
    setStatus(value) {
      this.form.status = value
    }
  }
}
