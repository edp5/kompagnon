import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitJourneyReview } from "@/adapters/journeys.js";
import ReviewModal from "@/components/ReviewModal.vue";

vi.mock("@/adapters/journeys.js", () => ({
  submitJourneyReview: vi.fn(),
}));

vi.mock("@/stores/auth.js", () => ({
  useAuthStore: () => ({
    token: "mock-jwt-token",
  }),
}));

function mountReviewModal(props = {}) {
  return mount(ReviewModal, {
    props: {
      isOpen: true,
      foundJourneyId: 42,
      userName: "Adrien Le Guen",
      ...props,
    },
  });
}

describe("Unit | Components | ReviewModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    // when
    const wrapper = mountReviewModal({ isOpen: false });

    // then
    expect(wrapper.find(".review-modal-backdrop").exists()).toBe(false);
  });

  it("should render modal header, companion name, 5 star buttons, and submit button", () => {
    // when
    const wrapper = mountReviewModal();

    // then
    expect(wrapper.find(".review-modal-backdrop").exists()).toBe(true);
    expect(wrapper.text()).toContain("Évaluer le trajet");
    expect(wrapper.text()).toContain("Adrien Le Guen");
    expect(wrapper.findAll(".review-modal__star-btn")).toHaveLength(5);
    expect(wrapper.find("textarea#review-comment").exists()).toBe(true);
    expect(wrapper.find("button[type=\"submit\"]").exists()).toBe(true);
  });

  it("should emit close event when clicking the close button", async () => {
    // given
    const wrapper = mountReviewModal();

    // when
    await wrapper.find(".review-modal__close").trigger("click");

    // then
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("should update star rating when clicking on a star button and display proper hints", async () => {
    // given
    const wrapper = mountReviewModal();
    const starButtons = wrapper.findAll(".review-modal__star-btn");

    const hints = [
      { index: 0, hint: "Décevant" },
      { index: 1, hint: "Moyen" },
      { index: 2, hint: "Correct" },
      { index: 3, hint: "Très bien" },
      { index: 4, hint: "Parfait !" },
    ];

    for (const { index, hint } of hints) {
      await starButtons[index].trigger("click");
      expect(wrapper.text()).toContain(hint);
    }
  });

  it("should handle star hover and mouseleave", async () => {
    // given
    const wrapper = mountReviewModal();
    const starButtons = wrapper.findAll(".review-modal__star-btn");

    await starButtons[1].trigger("mouseenter");
    expect(wrapper.findAll(".review-modal__star-btn--active").length).toBeGreaterThanOrEqual(2);

    await starButtons[1].trigger("mouseleave");
    expect(wrapper.text()).toContain("Parfait !");
  });

  it("should emit close when clicking the backdrop", async () => {
    // given
    const wrapper = mountReviewModal();

    // when
    await wrapper.find(".review-modal-backdrop").trigger("click");

    // then
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should reset form state when isOpen transitions to true", async () => {
    // given
    const wrapper = mountReviewModal({ isOpen: false });
    await wrapper.setProps({ isOpen: true });
    await flushPromises();

    // then
    expect(wrapper.find("textarea#review-comment").element.value).toBe("");
  });

  it("should call submitJourneyReview and emit submitted and close events on success", async () => {
    // given
    submitJourneyReview.mockResolvedValue({
      success: true,
      review: { id: 1, rating: 4, comment: "Très bon accompagnement" },
    });
    const wrapper = mountReviewModal();

    // when
    await wrapper.findAll(".review-modal__star-btn")[3].trigger("click"); // 4 stars
    await wrapper.find("textarea#review-comment").setValue("Très bon accompagnement");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    // then
    expect(submitJourneyReview).toHaveBeenCalledWith({
      token: "mock-jwt-token",
      foundJourneyId: 42,
      rating: 4,
      comment: "Très bon accompagnement",
    });
    expect(wrapper.emitted("submitted")).toBeTruthy();
    expect(wrapper.emitted("submitted")[0][0]).toEqual({
      id: 1,
      rating: 4,
      comment: "Très bon accompagnement",
    });
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should display error message returned by adapter on failure", async () => {
    // given
    submitJourneyReview.mockResolvedValue({
      success: false,
      message: "Vous avez déjà laissé un avis pour ce trajet.",
    });
    const wrapper = mountReviewModal();

    // when
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Vous avez déjà laissé un avis pour ce trajet.");
    expect(wrapper.emitted("submitted")).toBeFalsy();
    expect(wrapper.emitted("close")).toBeFalsy();
  });

  it("should emit close when Escape key is pressed", async () => {
    // given
    const wrapper = mountReviewModal();

    // when
    await wrapper.find(".review-modal-backdrop").trigger("keydown", { key: "Escape" });

    // then
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should change star rating on ArrowLeft and ArrowRight keys", async () => {
    // given
    const wrapper = mountReviewModal();
    const starButtons = wrapper.findAll(".review-modal__star-btn");

    // initial rating is 5 (index 4)
    expect(wrapper.text()).toContain("Parfait !");

    // press ArrowLeft on 5th star -> rating becomes 4
    await starButtons[4].trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.text()).toContain("Très bien");

    // press ArrowLeft on 4th star -> rating becomes 3
    await starButtons[3].trigger("keydown", { key: "ArrowLeft" });
    expect(wrapper.text()).toContain("Correct");

    // press ArrowRight on 3rd star -> rating becomes 4
    await starButtons[2].trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.text()).toContain("Très bien");
  });

  it("should display default error message when failure message is missing", async () => {
    // given
    submitJourneyReview.mockResolvedValue({
      success: false,
    });
    const wrapper = mountReviewModal();

    // when
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Une erreur est survenue lors de l'envoi de votre avis.");
  });
});

