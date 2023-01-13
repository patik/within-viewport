import { calculateDepthOfField } from './calculateDepthOfField'

describe('Calculating the depth of field with calculateDepthOfField', () => {
    describe('metric units (meters)', () => {
        test('35mm, f/2, crop factor of 1, 15 meters', () => {
            const result = calculateDepthOfField(35, 2, 1, 5, false)

            expect(result.dof).toBe(2.584690961719362)
            expect(result.dof.toString()).toBe('2.584690961719362')
            expect(result.toString()).toBe('2.584690961719362')

            expect(result.eighthDof).toBe(0.32308637021492026)
            expect(result.eighthDof.toString()).toBe('0.32308637021492026')

            expect(result.hf).toBe(20.451666666666668)
            expect(result.hf.toString()).toBe('20.451666666666668')

            expect(result.near).toBe(4.021931840567339)
            expect(result.near.toString()).toBe('4.021931840567339')

            expect(result.far).toBe(6.606622802286701)
            expect(result.far.toString()).toBe('6.606622802286701')

            expect(result.coc).toBe(0.03)
            expect(result.coc.toString()).toBe('0.03')
        })

        test('50mm, f/1.4, crop factor of 2, 25 meters', () => {
            const result = calculateDepthOfField(50, 1.414214, 2, 25, false)

            expect(result.dof).toBe(11.082093523926748)
            expect(result.dof.toString()).toBe('11.082093523926748')
            expect(result.toString()).toBe(`11.082093523926748`)

            expect(result.eighthDof).toBe(1.3852616904908435)
            expect(result.eighthDof.toString()).toBe('1.3852616904908435')

            expect(result.hf).toBe(117.90109372886046)
            expect(result.hf.toString()).toBe('117.90109372886046')

            expect(result.near).toBe(20.63203625607849)
            expect(result.near.toString()).toBe('20.63203625607849')

            expect(result.far).toBe(31.714129780005237)
            expect(result.far.toString()).toBe('31.714129780005237')

            expect(result.coc).toBe(0.015)
            expect(result.coc.toString()).toBe('0.015')
        })

        test('such that the far end of the range is infinity', () => {
            const result = calculateDepthOfField(24, 16, 1, 5, false)

            expect(result.dof).toBe(Infinity)
            expect(result.dof.toString()).toBe('Infinity')
            expect(result.toString()).toBe('Infinity')

            expect(result.eighthDof).toBe(Infinity)
            expect(result.eighthDof.toString()).toBe('Infinity')

            expect(result.hf).toBe(1.224)
            expect(result.hf.toString()).toBe('1.224')

            expect(result.near).toBe(0.9715025906735751)
            expect(result.near.toString()).toBe('0.9715025906735751')

            expect(result.far).toBe(Infinity)
            expect(result.far.toString()).toBe('Infinity')

            expect(result.coc).toBe(0.03)
            expect(result.coc.toString()).toBe('0.03')
        })
    })

    describe('imperial units (feet)', () => {
        test('35mm, f/2, crop factor of 1, 15 feet', () => {
            const result = calculateDepthOfField(35, 2, 1, 15, true)

            expect(result.dof).toBe(7.012923816256398)
            expect(result.dof.toString()).toBe(`7.012923816256398`)
            expect(result.toString()).toBe(`7' 0.2"`)

            expect(result.eighthDof).toBe(0.8766154770320498)
            expect(result.eighthDof.toString()).toBe('0.8766154770320498')

            expect(result.hf).toBe(67.09864391951007)
            expect(result.hf.toString()).toBe('67.09864391951007')

            expect(result.near).toBe(12.27274548830499)
            expect(result.near.toString()).toBe('12.27274548830499')

            expect(result.far).toBe(19.285669304561388)
            expect(result.far.toString()).toBe('19.285669304561388')

            expect(result.coc).toBe(0.03)
            expect(result.coc.toString()).toBe('0.03')
        })

        test('55mm, f/3.2, crop factor of 2.7, 42 feet', () => {
            const result = calculateDepthOfField(55, 3.174802, 2.7, 42, true)

            expect(result.dof).toBe(12.634717336600715)
            expect(result.dof.toString()).toBe('12.634717336600715')
            expect(result.toString()).toBe(`12' 7.6"`)

            expect(result.eighthDof).toBe(1.5793396670750894)
            expect(result.eighthDof.toString()).toBe('1.5793396670750894')

            expect(result.hf).toBe(284.36540359585547)
            expect(result.hf.toString()).toBe('284.36540359585547')

            expect(result.near).toBe(36.61227928000945)
            expect(result.near.toString()).toBe('36.61227928000945')

            expect(result.far).toBe(49.24699661661017)
            expect(result.far.toString()).toBe('49.24699661661017')

            expect(result.coc).toBe(0.011)
            expect(result.coc.toString()).toBe('0.011')
        })
    })
})
