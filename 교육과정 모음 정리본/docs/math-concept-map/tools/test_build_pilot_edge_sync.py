from __future__ import annotations

import unittest

import build_pilot


def edge_keys() -> set[tuple[str, str, str]]:
    return {
        (edge["source_id"], edge["target_id"], edge["relationship_type"])
        for edge in build_pilot.EDGES
    }


def concepts_by_id() -> dict[str, dict]:
    return {concept["id"]: concept for concept in build_pilot.CONCEPTS}


def edge_pairs_by_type(relationship_type: str) -> set[frozenset[str]]:
    return {
        frozenset([edge["source_id"], edge["target_id"]])
        for edge in build_pilot.EDGES
        if edge["relationship_type"] == relationship_type
    }


def edge_pairs_by_types(relationship_types: set[str]) -> set[frozenset[str]]:
    return {
        frozenset([edge["source_id"], edge["target_id"]])
        for edge in build_pilot.EDGES
        if edge["relationship_type"] in relationship_types
    }


def relationship_types_by_pair() -> dict[frozenset[str], set[str]]:
    grouped: dict[frozenset[str], set[str]] = {}
    for edge in build_pilot.EDGES:
        grouped.setdefault(frozenset([edge["source_id"], edge["target_id"]]), set()).add(
            edge["relationship_type"]
        )
    return grouped


class BuildPilotEdgeSyncTests(unittest.TestCase):
    def test_every_parent_id_is_mirrored_by_contains_edge(self) -> None:
        edges = edge_keys()
        missing = [
            (parent_id, concept["id"])
            for concept in build_pilot.CONCEPTS
            for parent_id in concept["parent_ids"]
            if (parent_id, concept["id"], "contains") not in edges
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_prerequisite_id_is_mirrored_by_prerequisite_edge(self) -> None:
        edges = edge_keys()
        missing = [
            (prerequisite_id, concept["id"])
            for concept in build_pilot.CONCEPTS
            for prerequisite_id in concept["prerequisite_ids"]
            if (prerequisite_id, concept["id"], "prerequisite_for") not in edges
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_contains_edge_is_mirrored_by_parent_id(self) -> None:
        concepts = concepts_by_id()
        missing = [
            (edge["source_id"], edge["target_id"])
            for edge in build_pilot.EDGES
            if edge["relationship_type"] == "contains"
            if edge["source_id"] not in concepts[edge["target_id"]]["parent_ids"]
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_prerequisite_edge_is_mirrored_by_prerequisite_id(self) -> None:
        concepts = concepts_by_id()
        missing = [
            (edge["source_id"], edge["target_id"])
            for edge in build_pilot.EDGES
            if edge["relationship_type"] == "prerequisite_for"
            if edge["source_id"] not in concepts[edge["target_id"]]["prerequisite_ids"]
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_every_misconception_related_id_has_confusion_edge(self) -> None:
        concepts = concepts_by_id()
        confused_pairs = edge_pairs_by_type("often_confused_with")
        missing = [
            (concept["id"], related_id)
            for concept in build_pilot.CONCEPTS
            for related_id in concept["related_ids"]
            if (
                concept["concept_type"] == "misconception_risk"
                or concepts[related_id]["concept_type"] == "misconception_risk"
            )
            if frozenset([concept["id"], related_id]) not in confused_pairs
        ]

        self.assertEqual([], missing[:20])
        self.assertEqual(0, len(missing))

    def test_related_ids_do_not_duplicate_only_structural_edges(self) -> None:
        structural_pairs = edge_pairs_by_types({"contains", "prerequisite_for"})
        semantic_pairs = edge_pairs_by_types(
            {
                "related_to",
                "equivalent_to",
                "contrasts_with",
                "often_confused_with",
                "represented_by",
                "used_in",
            }
        )
        duplicated = [
            (concept["id"], related_id)
            for concept in build_pilot.CONCEPTS
            for related_id in concept["related_ids"]
            if frozenset([concept["id"], related_id]) in structural_pairs
            if frozenset([concept["id"], related_id]) not in semantic_pairs
        ]

        self.assertEqual([], duplicated[:20])
        self.assertEqual(0, len(duplicated))

    def test_coordinate_semantic_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_coord_x_axis", "m1_coord_y_axis"]): "contrasts_with",
            frozenset(["m1_coord_origin", "m1_coord_x_axis"]): "related_to",
            frozenset(["m1_coord_origin", "m1_coord_y_axis"]): "related_to",
            frozenset(["m1_coord_x_axis", "m1_coord_axis_point"]): "related_to",
            frozenset(["m1_coord_y_axis", "m1_coord_axis_point"]): "related_to",
            frozenset(["m1_coord_coordinate", "m1_coord_ordered_pair"]): "represented_by",
            frozenset(["m1_coord_coordinate", "m1_coord_number_line"]): "represented_by",
            frozenset(["m1_coord_coordinate", "m1_coord_usefulness"]): "used_in",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_geometry_semantic_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_geo_intersection_line", "m1_geo_intersection_point"]): "related_to",
            frozenset(["m1_geo_point", "m1_geo_line"]): "contrasts_with",
            frozenset(["m1_geo_point", "m1_geo_plane"]): "contrasts_with",
            frozenset(["m1_geo_line", "m1_geo_plane"]): "contrasts_with",
            frozenset(["m1_geo_sine", "m1_geo_tangent_ratio"]): "contrasts_with",
            frozenset(["m1_geo_cosine", "m1_geo_tangent_ratio"]): "contrasts_with",
            frozenset(["m1_geo_circumcircle", "m1_geo_incircle"]): "contrasts_with",
            frozenset(["m1_geo_frustum_cone", "m1_geo_frustum_pyramid"]): "contrasts_with",
            frozenset(["m1_geo_model_tool_solid", "m1_geo_solid_cross_section"]): "used_in",
            frozenset(["m1_geo_opposite_angle", "m1_geo_opposite_side"]): "contrasts_with",
            frozenset(["m1_geo_arc", "m1_geo_central_angle"]): "related_to",
            frozenset(["m1_geo_exterior_angle", "m1_geo_interior_angle"]): "contrasts_with",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_algebra_function_and_polygon_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_geo_convex_polygon_scope", "m1_geo_diagonal_count"]): "related_to",
            frozenset(["m1_geo_convex_polygon_scope", "m1_geo_polygon_angle_sum"]): "related_to",
            frozenset(["m1_factor_square_difference_formula", "m1_factor_square_sum_formula"]): "contrasts_with",
            frozenset(["m1_expr_coefficient", "m1_expr_constant_term"]): "contrasts_with",
            frozenset(["m1_calc_base", "m1_calc_exponent"]): "contrasts_with",
            frozenset(["m1_quad_func_general_form", "m1_quad_func_vertex_form"]): "related_to",
            frozenset(["m1_eq_both_sides", "m1_eq_left_side"]): "contains",
            frozenset(["m1_eq_both_sides", "m1_eq_right_side"]): "contains",
            frozenset(["m1_func_x_intercept", "m1_func_y_intercept"]): "contrasts_with",
            frozenset(["m1_context_speed_distance", "m1_context_speed_time"]): "contrasts_with",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_number_data_and_representation_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_repr_expression", "m1_repr_table"]): "related_to",
            frozenset(["m1_num_rational_repeating_relation", "m1_num_repeating_decimal_to_fraction"]): "used_in",
            frozenset(["m1_num_addition", "m1_num_subtraction"]): "related_to",
            frozenset(["m1_num_associative_law", "m1_num_commutative_law"]): "contrasts_with",
            frozenset(["m1_num_division", "m1_num_multiplication"]): "related_to",
            frozenset(["m1_num_minus_sign", "m1_num_negative_number"]): "contrasts_with",
            frozenset(["m1_num_plus_sign", "m1_num_positive_number"]): "contrasts_with",
            frozenset(["m1_num_radical_expression", "m1_num_rationalize_denominator"]): "used_in",
            frozenset(["m1_data_and_probability", "m1_data_or_probability"]): "contrasts_with",
            frozenset(["m1_data_mean", "m1_data_mode"]): "contrasts_with",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_data_and_geometry_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_data_no_correlation", "m1_data_positive_correlation"]): "contrasts_with",
            frozenset(["m1_geo_straight_angle", "m1_geo_vertical_angles"]): "contrasts_with",
            frozenset(["m1_geo_similarity_judgement", "m1_geo_parallel_segment_ratio"]): "used_in",
            frozenset(["m1_geo_quadrilateral_relationship", "m1_geo_proof"]): "used_in",
            frozenset(["m1_geo_circle_unit", "m1_geo_plane_properties_unit"]): "related_to",
            frozenset(["m1_geo_model_tool_solid", "m1_geo_solid_net"]): "related_to",
            frozenset(["m1_geo_prism", "m1_geo_surface_area"]): "used_in",
            frozenset(["m1_geo_prism", "m1_geo_volume"]): "used_in",
            frozenset(["m1_geo_pyramid", "m1_geo_surface_area"]): "used_in",
            frozenset(["m1_geo_pyramid", "m1_geo_volume"]): "used_in",
            frozenset(["m1_geo_solid_cross_section", "m1_geo_solid_net"]): "related_to",
            frozenset(["m1_geo_sphere", "m1_geo_surface_area"]): "used_in",
            frozenset(["m1_geo_sphere", "m1_geo_volume"]): "used_in",
            frozenset(["m1_geo_triangle_construction", "m1_geo_triangle_congruence_conditions"]): "used_in",
            frozenset(["m1_geo_secant", "m1_geo_chord"]): "contrasts_with",
            frozenset(["m1_geo_right_triangle_judgement", "m1_geo_right_triangle"]): "used_in",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_algebra_equation_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_factor_quadratic_expression", "m1_quad_eq_quadratic_term"]): "contrasts_with",
            frozenset(["m1_expr_coefficient", "m1_expr_degree"]): "contrasts_with",
            frozenset(["m1_expr_literal_expression", "m1_repr_expression"]): "represented_by",
            frozenset(["m1_calc_arithmetic_to_polynomial_extension", "m1_calc_monomial_polynomial_mul_div"]): "used_in",
            frozenset(["m1_calc_arithmetic_to_polynomial_extension", "m1_calc_polynomial_add_sub"]): "used_in",
            frozenset(["m1_calc_simplify_expression", "m1_calc_monomial_polynomial_mul_div"]): "used_in",
            frozenset(["m1_calc_simplify_expression", "m1_calc_polynomial_add_sub"]): "used_in",
            frozenset(["m1_calc_unit", "m1_eq_unit"]): "related_to",
            frozenset(["m1_system_modeling", "m1_system_solution"]): "used_in",
            frozenset(["m1_system_modeling", "m1_system_solving"]): "used_in",
            frozenset(["m1_quad_eq_double_root", "m1_quad_eq_root_formula"]): "related_to",
            frozenset(["m1_quad_eq_modeling", "m1_quad_eq_standard_form"]): "represented_by",
            frozenset(["m1_quad_eq_root_formula", "m1_quad_eq_solution"]): "used_in",
            frozenset(["m1_quad_eq_solving", "m1_quad_eq_factorization_solving"]): "used_in",
            frozenset(["m1_quad_eq_standard_form", "m1_quad_eq_solving"]): "used_in",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_function_graph_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_quad_func_graph_drawing", "m1_quad_func_graph_properties"]): "used_in",
            frozenset(["m1_quad_func_vertex_form", "m1_quad_func_axis"]): "represented_by",
            frozenset(["m1_quad_func_vertex_form", "m1_quad_func_vertex"]): "represented_by",
            frozenset(["m1_quad_func_y_ax2_graph", "m1_quad_func_vertex_form"]): "related_to",
            frozenset(["m1_eq_modeling_linear_equation", "m1_eq_solution_check"]): "used_in",
            frozenset(["m1_eq_modeling_linear_equation", "m1_eq_solving_linear_equation"]): "used_in",
            frozenset(["m1_eq_unknown", "m1_eq_solution"]): "contrasts_with",
            frozenset(["m1_ineq_modeling_linear_inequality", "m1_ineq_solution_check"]): "used_in",
            frozenset(["m1_ineq_modeling_linear_inequality", "m1_ineq_solving_linear_inequality"]): "used_in",
            frozenset(["m1_func_find_graph_equation", "m1_func_slope"]): "used_in",
            frozenset(["m1_func_find_graph_equation", "m1_func_y_intercept"]): "used_in",
            frozenset(["m1_func_graph_drawing", "m1_func_slope"]): "used_in",
            frozenset(["m1_func_graph_drawing", "m1_func_x_intercept"]): "used_in",
            frozenset(["m1_func_graph_drawing", "m1_func_y_intercept"]): "used_in",
            frozenset(["m1_func_linear_formula", "m1_func_linear_graph"]): "represented_by",
            frozenset(["m1_func_linear_formula", "m1_func_y_ax_b_graph"]): "represented_by",
            frozenset(["m1_func_linear_formula", "m1_func_y_ax_graph"]): "represented_by",
            frozenset(["m1_func_parallel_translation", "m1_func_y_ax_graph"]): "related_to",
            frozenset(["m1_func_problem_solving", "m1_func_find_graph_equation"]): "used_in",
            frozenset(["m1_func_two_quantity_relation", "m1_func_function_judgement"]): "used_in",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_representation_and_number_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_func_y_ax_b_graph", "m1_func_slope"]): "related_to",
            frozenset(["m1_func_y_ax_b_graph", "m1_func_y_intercept"]): "related_to",
            frozenset(["m1_func_y_ax_graph", "m1_func_slope"]): "related_to",
            frozenset(["m1_func_intersection_count", "m1_func_system_graph_relation"]): "used_in",
            frozenset(["m1_graph_situation_graphing", "m1_repr_conversion"]): "used_in",
            frozenset(["m1_repr_everyday_language", "m1_graph_graph"]): "represented_by",
            frozenset(["m1_repr_everyday_language", "m1_repr_conversion"]): "used_in",
            frozenset(["m1_repr_everyday_language", "m1_repr_expression"]): "represented_by",
            frozenset(["m1_repr_everyday_language", "m1_repr_table"]): "represented_by",
            frozenset(["m1_repr_expression", "m1_graph_graph"]): "related_to",
            frozenset(["m1_repr_table", "m1_graph_graph"]): "related_to",
            frozenset(["m1_num_composite_number", "m1_num_prime_factorization"]): "used_in",
            frozenset(["m1_num_coprime", "m1_num_prime_factorization"]): "used_in",
            frozenset(["m1_num_fraction_decimal_classification", "m1_num_rational_repeating_relation"]): "used_in",
            frozenset(["m1_num_division", "m1_num_reciprocal"]): "used_in",
            frozenset(["m1_num_integer_rational_unit", "m1_num_square_root_real_unit"]): "related_to",
            frozenset(["m1_num_negative_need", "m1_num_number_line"]): "represented_by",
            frozenset(["m1_num_negative_rational", "m1_num_negative_number"]): "related_to",
            frozenset(["m1_num_positive_rational", "m1_num_positive_number"]): "related_to",
            frozenset(["m1_num_square_root_calculator", "m1_num_compare_square_roots"]): "used_in",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_data_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_data_representative_value", "m1_data_choose_representative_value"]): "used_in",
            frozenset(["m1_data_class_mark", "m1_data_frequency_table"]): "used_in",
            frozenset(["m1_data_class_width", "m1_data_frequency_table"]): "used_in",
            frozenset(["m1_data_class_width", "m1_data_histogram"]): "used_in",
            frozenset(["m1_data_frequency_table", "m1_data_frequency_polygon"]): "represented_by",
            frozenset(["m1_data_frequency_table", "m1_data_relative_frequency"]): "used_in",
            frozenset(["m1_data_relative_frequency_table_graph", "m1_data_distribution_interpretation"]): "used_in",
            frozenset(["m1_data_statistical_evidence_discussion", "m1_data_critical_graph_reading"]): "used_in",
            frozenset(["m1_data_technology_tool_stats", "m1_data_critical_graph_reading"]): "used_in",
            frozenset(["m1_data_compare_distributions_variability", "m1_data_box_plot_compare"]): "related_to",
            frozenset(["m1_data_deviation", "m1_data_standard_deviation"]): "used_in",
            frozenset(["m1_data_box_plot_compare", "m1_data_compare_distributions_variability"]): "related_to",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_geometry_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_geo_angle", "m1_geo_parallel_angle_properties"]): "used_in",
            frozenset(["m1_geo_parallel_angle_properties", "m1_geo_parallel_segment_ratio"]): "contrasts_with",
            frozenset(["m1_geo_vertical_angles", "m1_geo_parallel_angle_properties"]): "related_to",
            frozenset(["m1_geo_centroid_from_parallel_ratio", "m1_geo_median"]): "used_in",
            frozenset(["m1_geo_similar_figures", "m1_geo_correspondence"]): "represented_by",
            frozenset(["m1_geo_trig_unit", "m1_geo_triangle_quadrilateral_unit"]): "related_to",
            frozenset(["m1_geo_circle_justification", "m1_geo_justification"]): "used_in",
            frozenset(["m1_geo_tangent_length", "m1_geo_tangent_line"]): "used_in",
            frozenset(["m1_geo_tangent_relation", "m1_geo_tangent_property"]): "used_in",
            frozenset(["m1_geo_triangle_congruence_judgement", "m1_geo_justification"]): "used_in",
            frozenset(["m1_geo_sector_arc_length_area", "m1_geo_circle"]): "used_in",
            frozenset(["m1_geo_pythagorean_justification", "m1_geo_proof"]): "used_in",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_algebra_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_factor_binomial_product_xab", "m1_quad_eq_factorization_solving"]): "used_in",
            frozenset(["m1_factor_factor", "m1_expr_term"]): "contrasts_with",
            frozenset(["m1_expr_letter", "m1_repr_expression"]): "used_in",
            frozenset(["m1_expr_monomial", "m1_expr_term"]): "related_to",
            frozenset(["m1_expr_unit", "m1_coord_graph_unit"]): "related_to",
            frozenset(["m1_calc_polynomial_add_sub", "m1_expr_add_sub_linear_expression"]): "used_in",
            frozenset(["m1_system_two_variable_linear_equation", "m1_coord_graph_unit"]): "related_to",
            frozenset(["m1_system_two_variable_linear_equation", "m1_func_equation_relation"]): "used_in",
            frozenset(["m1_quad_eq_double_root", "m1_quad_eq_real_solution_scope"]): "related_to",
            frozenset(["m1_quad_eq_real_solution_scope", "m1_quad_eq_root_formula"]): "related_to",
            frozenset(["m1_quad_eq_unit", "m1_factor_factorization"]): "used_in",
            frozenset(["m1_quad_func_tech_tool_graph", "m1_func_tech_tool_graph"]): "used_in",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_function_equation_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_eq_unknown", "m1_term_variable"]): "contrasts_with",
            frozenset(["m1_ineq_solution", "m1_eq_solution"]): "contrasts_with",
            frozenset(["m1_ineq_unit", "m1_system_unit"]): "related_to",
            frozenset(["m1_func_unit", "m1_system_unit"]): "related_to",
            frozenset(["m1_func_value", "m1_expr_value"]): "contrasts_with",
            frozenset(["m1_func_eq_relation_unit", "m1_coord_graph_unit"]): "related_to",
            frozenset(["m1_func_two_variable_equation_as_graph", "m1_system_solution"]): "used_in",
            frozenset(["m1_repr_everyday_language", "m1_expr_letter"]): "used_in",
            frozenset(["m1_repr_expression", "m1_expr_value"]): "used_in",
            frozenset(["m1_term_variable", "m1_prop_direct_proportion"]): "used_in",
            frozenset(["m1_term_variable", "m1_prop_inverse_proportion"]): "used_in",
            frozenset(["m1_num_positive_integer", "m1_num_natural_number"]): "equivalent_to",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_data_variability_queue_related_ids_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_data_representative_unit", "m1_data_variability_unit"]): "related_to",
            frozenset(["m1_data_frequency_unit", "m1_data_variability_unit"]): "related_to",
            frozenset(["m1_data_variability", "m1_data_deviation"]): "related_to",
            frozenset(["m1_data_variability", "m1_data_standard_deviation"]): "related_to",
            frozenset(["m1_data_variability", "m1_data_variance"]): "related_to",
            frozenset(["m1_data_dataset", "m1_data_data_collection"]): "related_to",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)

    def test_remaining_related_edge_queue_pairs_have_reviewed_edges(self) -> None:
        relationships = relationship_types_by_pair()
        expected = {
            frozenset(["m1_geo_distance_between_two_points", "m1_num_absolute_value"]): "related_to",
            frozenset(["m1_geo_intersection_point", "m1_func_intersection_point"]): "contrasts_with",
            frozenset(["m1_geo_domain", "m1_coord_graph_unit"]): "related_to",
            frozenset(["m1_geo_domain", "m1_num_domain"]): "related_to",
            frozenset(["m1_num_prime_factor", "m1_factor_factor"]): "contrasts_with",
            frozenset(["m1_num_domain", "m1_calc_unit"]): "related_to",
            frozenset(["m1_num_domain", "m1_expr_unit"]): "related_to",
            frozenset(["m1_num_distributive_law", "m1_factor_polynomial_multiplication"]): "used_in",
            frozenset(["m1_num_mixed_calculation", "m1_calc_simplify_expression"]): "used_in",
            frozenset(["m1_num_number_line", "m1_coord_number_line"]): "related_to",
            frozenset(["m1_data_domain", "m1_graph_graph"]): "represented_by",
            frozenset(["m1_data_domain", "m1_num_domain"]): "related_to",
            frozenset(["m1_data_domain", "m1_repr_table"]): "represented_by",
            frozenset(["m1_geo_triangle_midpoint_theorem", "m1_geo_centroid"]): "related_to",
            frozenset(["m1_expr_usefulness", "m1_term_variable"]): "related_to",
            frozenset(["m1_ineq_inequality", "m1_eq_equality"]): "contrasts_with",
            frozenset(["m1_geo_point", "m1_coord_point_location"]): "related_to",
            frozenset(["m1_num_prime_factor_unit", "m1_calc_power"]): "related_to",
        }
        missing = [
            (tuple(sorted(pair)), relationship_type)
            for pair, relationship_type in expected.items()
            if relationship_type not in relationships.get(pair, set())
        ]

        self.assertEqual([], missing)


if __name__ == "__main__":
    unittest.main()
